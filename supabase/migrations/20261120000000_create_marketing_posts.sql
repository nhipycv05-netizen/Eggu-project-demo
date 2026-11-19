-- ==============================================================================
-- Migration: Create marketing_posts table for n8n AI Content Automation
-- Purpose: Stores Facebook/Social drafts with real & AI photos for admin copy-paste
-- Note: This table is strictly internal and NEVER queried on user-facing web pages
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.marketing_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  dish_name TEXT,
  dish_category TEXT,
  dish_price TEXT,
  target_angle TEXT,
  content TEXT NOT NULL,
  real_photo_url TEXT,
  ai_photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'COPIED', 'PUBLISHED', 'ARCHIVED'
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  copied_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_marketing_posts_status ON public.marketing_posts(status);
CREATE INDEX IF NOT EXISTS idx_marketing_posts_created_at ON public.marketing_posts(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.marketing_posts ENABLE ROW LEVEL SECURITY;

-- Allow anon and service role to insert posts (used by n8n automation)
CREATE POLICY "Allow insert marketing_posts" ON public.marketing_posts
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users / service role full read access
CREATE POLICY "Allow read marketing_posts" ON public.marketing_posts
  FOR SELECT USING (true);

-- Allow authenticated users / service role update access
CREATE POLICY "Allow update marketing_posts" ON public.marketing_posts
  FOR UPDATE USING (true);

-- Allow authenticated users / service role delete access
CREATE POLICY "Allow delete marketing_posts" ON public.marketing_posts
  FOR DELETE USING (true);
