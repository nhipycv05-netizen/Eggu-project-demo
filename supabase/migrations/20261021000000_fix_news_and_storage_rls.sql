-- Migration: Fix Row Level Security (RLS) policies for news table & Supabase Storage buckets
-- Author: Eggu Development Team
-- Date: 2026-10-21

-- ==============================================================================
-- 1. POLICIES FOR public.news TABLE
-- ==============================================================================

-- Ensure RLS is enabled
alter table public.news enable row level security;

-- Drop existing policies if any to avoid duplication errors
drop policy if exists "Allow public read published news" on public.news;
drop policy if exists "Allow admin full access to news" on public.news;
drop policy if exists "Allow authenticated select all news" on public.news;
drop policy if exists "Allow authenticated insert news" on public.news;
drop policy if exists "Allow authenticated update news" on public.news;
drop policy if exists "Allow authenticated delete news" on public.news;

-- Public can only read published news
create policy "Allow public read published news" on public.news
  for select
  using (status = 'PUBLISHED' and (published_at is null or published_at <= now()));

-- Authenticated admins have full permissions (SELECT, INSERT, UPDATE, DELETE)
create policy "Allow admin full access to news" on public.news
  for all
  to authenticated
  using (true)
  with check (true);

-- ==============================================================================
-- 2. ENSURE STORAGE BUCKETS EXIST AND ARE PUBLIC
-- ==============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values 
  ('news', 'news', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('promotions', 'promotions', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('categories', 'categories', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set 
  public = true,
  file_size_limit = 5242880;

-- ==============================================================================
-- 3. STORAGE OBJECTS POLICIES FOR NEWS BUCKET
-- ==============================================================================

drop policy if exists "Public read news bucket" on storage.objects;
drop policy if exists "Authenticated insert news bucket" on storage.objects;
drop policy if exists "Authenticated update news bucket" on storage.objects;
drop policy if exists "Authenticated delete news bucket" on storage.objects;

-- Allow anyone to view news images
create policy "Public read news bucket"
on storage.objects for select
using (bucket_id = 'news');

-- Allow authenticated admins to upload images to news bucket
create policy "Authenticated insert news bucket"
on storage.objects for insert
to authenticated
with check (bucket_id = 'news');

-- Allow authenticated admins to update images in news bucket
create policy "Authenticated update news bucket"
on storage.objects for update
to authenticated
using (bucket_id = 'news')
with check (bucket_id = 'news');

-- Allow authenticated admins to delete images in news bucket
create policy "Authenticated delete news bucket"
on storage.objects for delete
to authenticated
using (bucket_id = 'news');

-- ==============================================================================
-- 4. STORAGE OBJECTS POLICIES FOR PROMOTIONS & CATEGORIES BUCKETS
-- ==============================================================================

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
