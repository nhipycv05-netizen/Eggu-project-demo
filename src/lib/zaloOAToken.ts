import { createServiceRoleClient } from '@/lib/supabase/serviceRole';

/**
 * Zalo OA access token provider (server-only) with automatic refresh.
 *
 * Refresh: POST https://oauth.zaloapp.com/v4/oa/access_token
 *   Header `secret_key: <app secret>`, form body refresh_token + app_id + grant_type=refresh_token
 * Docs: https://developers.zalo.me/docs/official-account/bat-dau/xac-thuc-va-uy-quyen-cho-ung-dung-new
 *
 * Zalo rules: access token lives 25h, refresh token 3 months and is single-use. Every refresh
 * returns a NEW pair and immediately invalidates the old access token, so the latest pair is
 * persisted in Supabase (table zalo_oa_tokens). Env vars only seed the store the first time
 * (or after a manual re-authorization, when the stored refresh token no longer works).
 *
 * Tokens are never logged or returned to callers outside the server.
 */

const ZALO_OAUTH_URL = 'https://oauth.zaloapp.com/v4/oa/access_token';
const REQUEST_TIMEOUT_MS = 8000;
// Refresh a bit before Zalo's expiry so in-flight sends do not hit -216/-220
const REFRESH_MARGIN_MS = 10 * 60 * 1000;
const TOKEN_ROW_ID = 1;

interface ZaloTokenPair {
  accessToken: string;
  refreshToken: string;
  /** null when unknown (seeded from env) */
  expiresAt: number | null;
}

interface ZaloTokenRow {
  access_token: string;
  refresh_token: string;
  access_token_expires_at: string | null;
}

interface ZaloOAuthResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: string | number;
  error?: number | string;
  error_name?: string;
  error_description?: string;
  message?: string;
}

let cached: ZaloTokenPair | null = null;
let refreshInFlight: Promise<string | null> | null = null;

function envTokenPair(): ZaloTokenPair | null {
  const accessToken = process.env.ZALO_OA_ACCESS_TOKEN?.trim() || '';
  const refreshToken = process.env.ZALO_OA_REFRESH_TOKEN?.trim() || '';
  if (!accessToken && !refreshToken) return null;
  return { accessToken, refreshToken, expiresAt: null };
}

/** True when env provides at least an access token or a refresh token to start from */
export function hasZaloOACredentials(): boolean {
  return envTokenPair() !== null;
}

async function loadStoredPair(): Promise<ZaloTokenPair | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('zalo_oa_tokens')
    .select('access_token, refresh_token, access_token_expires_at')
    .eq('id', TOKEN_ROW_ID)
    .maybeSingle<ZaloTokenRow>();

  if (error) {
    console.error(`[zalo-oa-token] Failed to read token store: ${error.message}`);
    return null;
  }
  if (!data) return null;
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.access_token_expires_at ? Date.parse(data.access_token_expires_at) : null,
  };
}

async function saveStoredPair(pair: ZaloTokenPair): Promise<void> {
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from('zalo_oa_tokens').upsert({
    id: TOKEN_ROW_ID,
    access_token: pair.accessToken,
    refresh_token: pair.refreshToken,
    access_token_expires_at: pair.expiresAt ? new Date(pair.expiresAt).toISOString() : null,
    updated_at: new Date().toISOString(),
  });
  if (error) {
    // The old refresh token is already consumed: losing the new pair means re-authorizing manually.
    console.error(
      `[zalo-oa-token] CRITICAL: refreshed tokens could not be saved (${error.message}). ` +
        'Run the zalo_oa_tokens migration and check SUPABASE_SERVICE_ROLE_KEY.',
    );
  }
}

async function currentPair(): Promise<ZaloTokenPair | null> {
  if (!cached) {
    cached = (await loadStoredPair()) ?? envTokenPair();
  }
  return cached;
}

const isExpiringSoon = (pair: ZaloTokenPair) =>
  pair.expiresAt !== null && pair.expiresAt - REFRESH_MARGIN_MS <= Date.now();

async function requestNewPair(refreshToken: string): Promise<ZaloTokenPair | null> {
  const appId = process.env.ZALO_APP_ID?.trim();
  const appSecret = process.env.ZALO_APP_SECRET?.trim();
  if (!appId || !appSecret) {
    console.error('[zalo-oa-token] Cannot refresh: ZALO_APP_ID or ZALO_APP_SECRET is not set');
    return null;
  }

  try {
    const response = await fetch(ZALO_OAUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', secret_key: appSecret },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        app_id: appId,
        grant_type: 'refresh_token',
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: 'no-store',
    });
    const body = (await response.json().catch(() => null)) as ZaloOAuthResponse | null;

    if (!body?.access_token || !body.refresh_token) {
      const detail = body
        ? [body.error, body.error_name, body.error_description ?? body.message]
            .filter((v) => v !== undefined && v !== '')
            .join(' ')
        : 'non-JSON response';
      console.error(`[zalo-oa-token] Refresh rejected (HTTP ${response.status}): ${detail}`);
      return null;
    }

    const expiresInSeconds = Number(body.expires_in);
    return {
      accessToken: body.access_token,
      refreshToken: body.refresh_token,
      expiresAt: Number.isFinite(expiresInSeconds) ? Date.now() + expiresInSeconds * 1000 : null,
    };
  } catch (error) {
    console.error(
      `[zalo-oa-token] Refresh request failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  }
}

async function doRefresh(staleAccessToken: string | null): Promise<string | null> {
  // Another instance may already have rotated the tokens: re-read the store first.
  const stored = await loadStoredPair();
  if (stored && stored.accessToken !== staleAccessToken && !isExpiringSoon(stored)) {
    cached = stored;
    return stored.accessToken;
  }

  // Try the stored refresh token, then the env one (covers first run and manual re-authorization).
  const candidates = [stored?.refreshToken, process.env.ZALO_OA_REFRESH_TOKEN?.trim()].filter(
    (token, index, all): token is string => Boolean(token) && all.indexOf(token) === index,
  );
  if (candidates.length === 0) {
    console.error('[zalo-oa-token] Cannot refresh: no refresh token (set ZALO_OA_REFRESH_TOKEN)');
    return null;
  }

  for (const refreshToken of candidates) {
    const pair = await requestNewPair(refreshToken);
    if (pair) {
      cached = pair;
      await saveStoredPair(pair);
      console.info(
        `[zalo-oa-token] Access token refreshed, valid until ${
          pair.expiresAt ? new Date(pair.expiresAt).toISOString() : 'unknown'
        }`,
      );
      return pair.accessToken;
    }
  }
  return null;
}

/**
 * Get a new access token from Zalo. Concurrent callers in this process share one refresh,
 * because the refresh token can only be used once.
 * @param staleAccessToken the token Zalo just rejected (skips the refresh if it was already replaced)
 */
export function refreshZaloAccessToken(staleAccessToken: string | null): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = doRefresh(staleAccessToken).finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

/** Current OA access token, refreshed first when it is about to expire. Null if unavailable. */
export async function getZaloAccessToken(): Promise<string | null> {
  const pair = await currentPair();
  if (!pair) return null;
  if (!pair.accessToken || isExpiringSoon(pair)) {
    return refreshZaloAccessToken(pair.accessToken || null);
  }
  return pair.accessToken;
}
