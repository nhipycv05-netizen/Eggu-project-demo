-- ==============================================================================
-- Migration: Fix Row Level Security (RLS) & Triggers for News Status Case-Insensitivity
-- Author: Eggu Development Team
-- Date: 2026-11-04
-- ==============================================================================

-- 1. Chuẩn hóa tất cả bản ghi hiện có về status chữ HOA
update public.news
set status = upper(status)
where status != upper(status);

-- 2. Cập nhật Policy RLS cho phép công chúng đọc bài viết bất kể 'PUBLISHED' hay 'published'
drop policy if exists "Allow public read published news" on public.news;

create policy "Allow public read published news" on public.news
  for select
  using (
    upper(status) = 'PUBLISHED' 
    and (published_at is null or published_at <= now())
  );

-- 3. Tạo Trigger tự động chuẩn hóa status thành chữ HOA trước khi Insert hoặc Update
-- Giúp n8n, API hoặc bất kỳ workflow nào gửi 'published' hay 'draft' đều tự động thành 'PUBLISHED' hay 'DRAFT'
create or replace function public.normalize_news_status()
returns trigger as $$
begin
  if new.status is not null then
    new.status := upper(trim(new.status));
  else
    new.status := 'DRAFT';
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_normalize_news_status on public.news;
create trigger trg_normalize_news_status
  before insert or update of status on public.news
  for each row
  execute function public.normalize_news_status();

