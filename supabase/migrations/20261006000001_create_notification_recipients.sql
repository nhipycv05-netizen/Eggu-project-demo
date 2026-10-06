-- People who receive new-order notifications via the EGGU Zalo OA
-- (admin, shop owner, staff, delivery partner...). Managed from Admin > Người nhận thông báo.
create table if not exists public.notification_recipients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default 'staff' check (role in ('admin', 'owner', 'staff', 'delivery', 'other')),
  zalo_user_id text not null unique check (zalo_user_id ~ '^[0-9]{1,32}$'),
  is_active boolean not null default true,
  note text,
  -- Result of the last "Gửi tin thử" from the admin panel
  last_test_at timestamptz,
  last_test_ok boolean,
  last_test_error text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.notification_recipients enable row level security;

-- Admin policy (authenticated users have full permission), same as other admin-managed tables
create policy "Allow admin full access to notification_recipients" on public.notification_recipients
  for all to authenticated using (true) with check (true);

-- Initial recipients: current admin (previously ZALO_ADMIN_USER_ID) + one more recipient.
-- Rename / change role later in Admin > Người nhận thông báo.
insert into public.notification_recipients (name, role, zalo_user_id)
values
  ('Admin', 'admin', '4055972888995015783'),
  ('Quốc Toàn', 'admin', '4203595258280909395')
on conflict (zalo_user_id) do nothing;
