-- ==============================================================================
-- Migration: Fix Row Level Security (RLS) policies for news table & Storage buckets
-- Author: Eggu Development Team
-- Date: 2026-10-21
-- ==============================================================================

-- 1. POLICIES CHO BẢNG public.news
-- ------------------------------------------------------------------------------
alter table public.news enable row level security;

drop policy if exists "Allow public read published news" on public.news;
drop policy if exists "Allow admin full access to news" on public.news;
drop policy if exists "Allow authenticated select all news" on public.news;
drop policy if exists "Allow authenticated insert news" on public.news;
drop policy if exists "Allow authenticated update news" on public.news;
drop policy if exists "Allow authenticated delete news" on public.news;

-- Người dùng công khai chỉ được đọc bài viết đã xuất bản
create policy "Allow public read published news" on public.news
  for select
  using (status = 'PUBLISHED' and (published_at is null or published_at <= now()));

-- Quản trị viên (authenticated) có toàn quyền thêm, sửa, xóa, xem tất cả bài viết
create policy "Allow admin full access to news" on public.news
  for all
  to authenticated
  using (true)
  with check (true);

-- ------------------------------------------------------------------------------
-- 2. CẤU HÌNH BUCKET TRONG storage.buckets (PUBLIC, FILE SIZE, MIME TYPES)
-- ------------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values 
  ('news', 'news', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('promotions', 'promotions', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('categories', 'categories', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- ------------------------------------------------------------------------------
-- 3. CHÍNH SÁCH RLS TRÊN storage.objects CHO BUCKET 'news'
-- ------------------------------------------------------------------------------
drop policy if exists "Public read news bucket" on storage.objects;
drop policy if exists "Authenticated insert news bucket" on storage.objects;
drop policy if exists "Authenticated update news bucket" on storage.objects;
drop policy if exists "Authenticated delete news bucket" on storage.objects;
drop policy if exists "Allow anon upload news bucket" on storage.objects;
drop policy if exists "Allow anon update news bucket" on storage.objects;

-- Cho phép mọi người xem ảnh bài viết công khai
create policy "Public read news bucket"
on storage.objects for select
using (bucket_id = 'news');

-- Cho phép authenticated users tải ảnh lên bucket news
create policy "Authenticated insert news bucket"
on storage.objects for insert
to authenticated
with check (bucket_id = 'news');

-- Cho phép authenticated users cập nhật ảnh trong bucket news
create policy "Authenticated update news bucket"
on storage.objects for update
to authenticated
using (bucket_id = 'news')
with check (bucket_id = 'news');

-- Cho phép authenticated users xóa ảnh trong bucket news
create policy "Authenticated delete news bucket"
on storage.objects for delete
to authenticated
using (bucket_id = 'news');

-- Cấp thêm quyền upload cho anon để đảm bảo trình duyệt tải ảnh không bị nghẽn khi phiên đang refresh
create policy "Allow anon upload news bucket"
on storage.objects for insert
to anon
with check (bucket_id = 'news');

create policy "Allow anon update news bucket"
on storage.objects for update
to anon
using (bucket_id = 'news')
with check (bucket_id = 'news');

-- ------------------------------------------------------------------------------
-- 4. CHÍNH SÁCH RLS TRÊN storage.objects CHO 'promotions' VÀ 'categories'
-- ------------------------------------------------------------------------------
drop policy if exists "Public read promotions bucket" on storage.objects;
drop policy if exists "Authenticated insert promotions bucket" on storage.objects;
drop policy if exists "Authenticated update promotions bucket" on storage.objects;
drop policy if exists "Authenticated delete promotions bucket" on storage.objects;

create policy "Public read promotions bucket"
on storage.objects for select using (bucket_id = 'promotions');

create policy "Authenticated insert promotions bucket"
on storage.objects for insert to authenticated with check (bucket_id = 'promotions');

create policy "Authenticated update promotions bucket"
on storage.objects for update to authenticated using (bucket_id = 'promotions') with check (bucket_id = 'promotions');

create policy "Authenticated delete promotions bucket"
on storage.objects for delete to authenticated using (bucket_id = 'promotions');

drop policy if exists "Public read categories bucket" on storage.objects;
drop policy if exists "Authenticated insert categories bucket" on storage.objects;
drop policy if exists "Authenticated update categories bucket" on storage.objects;
drop policy if exists "Authenticated delete categories bucket" on storage.objects;

create policy "Public read categories bucket"
on storage.objects for select using (bucket_id = 'categories');

create policy "Authenticated insert categories bucket"
on storage.objects for insert to authenticated with check (bucket_id = 'categories');

create policy "Authenticated update categories bucket"
on storage.objects for update to authenticated using (bucket_id = 'categories') with check (bucket_id = 'categories');

create policy "Authenticated delete categories bucket"
on storage.objects for delete to authenticated using (bucket_id = 'categories');
