-- Migration: Add usage_limit and used_count to promotions table
ALTER TABLE public.promotions
  ADD COLUMN IF NOT EXISTS usage_limit integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS used_count integer DEFAULT 0 NOT NULL;

-- Check constraint to ensure used_count is never negative
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'promotions_used_count_non_negative'
  ) THEN
    ALTER TABLE public.promotions
      ADD CONSTRAINT promotions_used_count_non_negative CHECK (used_count >= 0);
  END IF;
END $$;
