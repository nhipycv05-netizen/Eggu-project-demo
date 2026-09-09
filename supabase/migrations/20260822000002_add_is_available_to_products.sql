-- Migration: Add is_available column to products table
-- EGGU - Korean Egg Sandwich

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true NOT NULL;

-- Ensure all existing rows are set to true if null
UPDATE public.products
SET is_available = true
WHERE is_available IS NULL;
