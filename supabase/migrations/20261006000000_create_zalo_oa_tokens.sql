-- Zalo OA token store (single row).
-- Zalo rotates BOTH tokens on every refresh (refresh token is single-use, old access token is
-- invalidated immediately), so the latest pair must be persisted outside env vars.
create table if not exists public.zalo_oa_tokens (
  id smallint primary key default 1 check (id = 1),
  access_token text not null,
  refresh_token text not null,
  access_token_expires_at timestamptz,
  updated_at timestamptz default now() not null
);

-- RLS on with NO policies: only the service role key (server-side) can read/write tokens.
alter table public.zalo_oa_tokens enable row level security;
