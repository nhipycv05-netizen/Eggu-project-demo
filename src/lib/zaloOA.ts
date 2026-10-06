/**
 * Zalo Official Account (OA) messaging client (server-only).
 *
 * Sends OA "Tư vấn" (consultation / cs) text messages via the Zalo OA Open API v3:
 *   POST https://openapi.zalo.me/v3.0/oa/message/cs
 *   Header `access_token: <OA access token>`
 *   Body   { recipient: { user_id }, message: { text } }  (text max 2.000 chars)
 * Docs: https://developers.zalo.me/docs/official-account/tin-nhan/tin-tu-van/gui-tin-tu-van-dang-van-ban
 *
 * Delivery conditions (Zalo rules, not enforced here): the recipient must have interacted with the
 * OA within the last 7 days and not be blocking it; otherwise Zalo returns -230 / -232.
 *
 * The access token comes from ./zaloOAToken (auto-refreshed, never logged or returned).
 * If Zalo rejects it (-216 / -220) the token is refreshed and the send is retried once.
 */

import { getZaloAccessToken, hasZaloOACredentials, refreshZaloAccessToken } from './zaloOAToken';

const ZALO_CS_MESSAGE_URL = 'https://openapi.zalo.me/v3.0/oa/message/cs';
const REQUEST_TIMEOUT_MS = 8000;
const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [500, 1500];
export const ZALO_TEXT_MAX_LENGTH = 2000;

// Zalo error codes from https://developers.zalo.me/docs/official-account/phu-luc/ma-loi
const ZALO_ERROR_HINTS: Record<number, string> = {
  [-32]: 'Rate limit exceeded',
  [-211]: 'Out of quota',
  [-213]: 'User has not followed the OA',
  [-216]: 'Access token is invalid',
  [-220]: 'Access token is expired or removed',
  [-224]: 'OA tier package does not allow this feature',
  [-227]: 'User is banned or inactive for more than 45 days',
  [-230]: 'User has not interacted with the OA in the last 7 days',
  [-232]: 'User has not interacted with the OA or the interaction has expired',
  [-244]: 'User has restricted this message type from the OA',
};
const TOKEN_ERROR_CODES = new Set([-216, -220]);
const RETRYABLE_ZALO_ERROR_CODES = new Set([-32]);

export interface ZaloTextMessage {
  text: string;
}

export type ZaloMessage = ZaloTextMessage;

export type ZaloSendFailureReason =
  | 'not_configured'
  | 'invalid_recipient'
  | 'invalid_message'
  | 'zalo_error'
  | 'http_error'
  | 'timeout'
  | 'network_error';

export type ZaloSendResult =
  | { ok: true; userId: string; messageId: string }
  | {
      ok: false;
      userId: string;
      reason: ZaloSendFailureReason;
      error: string;
      /** Zalo's `error` code when the API answered with one */
      zaloErrorCode?: number;
    };

export interface ZaloBatchSendResult {
  sent: number;
  failed: number;
  results: ZaloSendResult[];
}

export interface ZaloNotificationService {
  sendMessage(userId: string, message: ZaloMessage): Promise<ZaloSendResult>;
  sendToMany(userIds: string[], message: ZaloMessage): Promise<ZaloBatchSendResult>;
}

interface ZaloApiResponse {
  error: number;
  message?: string;
  data?: { message_id?: string; user_id?: string };
}

export function isZaloOAConfigured(): boolean {
  return hasZaloOACredentials();
}

/** Zalo user IDs are OA-scoped numeric strings */
export function isValidZaloUserId(userId: string): boolean {
  return /^\d{1,32}$/.test(userId);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface AttemptResult {
  result: ZaloSendResult;
  retryable: boolean;
}

async function postTextMessage(
  accessToken: string,
  userId: string,
  text: string,
): Promise<AttemptResult> {
  let response: Response;
  try {
    response = await fetch(ZALO_CS_MESSAGE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', access_token: accessToken },
      body: JSON.stringify({ recipient: { user_id: userId }, message: { text } }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: 'no-store',
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      // Not retried: the message may already have been delivered.
      return {
        result: {
          ok: false,
          userId,
          reason: 'timeout',
          error: `No response after ${REQUEST_TIMEOUT_MS}ms`,
        },
        retryable: false,
      };
    }
    return {
      result: {
        ok: false,
        userId,
        reason: 'network_error',
        error: error instanceof Error ? error.message : String(error),
      },
      retryable: true,
    };
  }

  let body: ZaloApiResponse | null = null;
  try {
    body = (await response.json()) as ZaloApiResponse;
  } catch {
    // handled below
  }

  if (!response.ok || !body || typeof body.error !== 'number') {
    return {
      result: {
        ok: false,
        userId,
        reason: 'http_error',
        error: `HTTP ${response.status}${body ? '' : ' (non-JSON response)'}`,
      },
      retryable: response.status === 429 || response.status >= 500,
    };
  }

  if (body.error !== 0) {
    const hint = ZALO_ERROR_HINTS[body.error];
    return {
      result: {
        ok: false,
        userId,
        reason: 'zalo_error',
        zaloErrorCode: body.error,
        error: [body.message, hint].filter(Boolean).join(' — ') || 'Unknown Zalo error',
      },
      retryable: RETRYABLE_ZALO_ERROR_CODES.has(body.error),
    };
  }

  return { result: { ok: true, userId, messageId: body.data?.message_id ?? '' }, retryable: false };
}

const isTokenError = (result: ZaloSendResult): boolean =>
  !result.ok && result.zaloErrorCode !== undefined && TOKEN_ERROR_CODES.has(result.zaloErrorCode);

async function sendWithRetries(
  accessToken: string,
  userId: string,
  text: string,
): Promise<ZaloSendResult> {
  let attemptResult = await postTextMessage(accessToken, userId, text);
  for (let attempt = 1; attempt < MAX_ATTEMPTS && attemptResult.retryable; attempt++) {
    const failed = attemptResult.result as Extract<ZaloSendResult, { ok: false }>;
    console.warn(`[zalo-oa] Retrying send to ${userId} (attempt ${attempt + 1}): ${failed.error}`);
    await sleep(RETRY_DELAYS_MS[attempt - 1]);
    attemptResult = await postTextMessage(accessToken, userId, text);
  }
  return attemptResult.result;
}

/**
 * Send a text message from the OA to one Zalo user.
 * Never throws: failures are returned as `{ ok: false, reason, error }`.
 */
async function sendMessage(userId: string, message: ZaloMessage): Promise<ZaloSendResult> {
  const recipient = userId?.trim() ?? '';

  if (!isValidZaloUserId(recipient)) {
    return {
      ok: false,
      userId: recipient,
      reason: 'invalid_recipient',
      error: 'Invalid Zalo user_id',
    };
  }

  const text = message.text?.trim() ?? '';
  if (!text || text.length > ZALO_TEXT_MAX_LENGTH) {
    return {
      ok: false,
      userId: recipient,
      reason: 'invalid_message',
      error: `Message text must be 1-${ZALO_TEXT_MAX_LENGTH} characters (got ${text.length})`,
    };
  }

  const accessToken = await getZaloAccessToken();
  if (!accessToken) {
    return {
      ok: false,
      userId: recipient,
      reason: 'not_configured',
      error: 'No usable Zalo OA access token (check [zalo-oa-token] logs)',
    };
  }

  let finalResult = await sendWithRetries(accessToken, recipient, text);
  if (isTokenError(finalResult)) {
    const freshToken = await refreshZaloAccessToken(accessToken);
    if (freshToken) {
      finalResult = await sendWithRetries(freshToken, recipient, text);
    }
  }

  if (finalResult.ok) {
    console.info(`[zalo-oa] Sent message ${finalResult.messageId} to ${recipient}`);
  } else if (isTokenError(finalResult)) {
    console.error(
      `[zalo-oa] Access token rejected (${finalResult.zaloErrorCode}) and could not be refreshed. ` +
        'Re-authorize the OA and update ZALO_OA_ACCESS_TOKEN / ZALO_OA_REFRESH_TOKEN.',
    );
  } else {
    console.error(
      `[zalo-oa] Failed to send to ${recipient} [${finalResult.reason}${finalResult.zaloErrorCode !== undefined ? ` ${finalResult.zaloErrorCode}` : ''}]: ${finalResult.error}`,
    );
  }

  return finalResult;
}

/**
 * Send the same message to several Zalo users. Duplicate IDs are sent once;
 * one recipient failing does not affect the others.
 */
async function sendToMany(userIds: string[], message: ZaloMessage): Promise<ZaloBatchSendResult> {
  const uniqueIds = [...new Set(userIds.map((id) => id.trim()).filter(Boolean))];
  const results = await Promise.all(uniqueIds.map((id) => sendMessage(id, message)));
  const sent = results.filter((r) => r.ok).length;
  return { sent, failed: results.length - sent, results };
}

export const zaloOA: ZaloNotificationService = { sendMessage, sendToMany };
