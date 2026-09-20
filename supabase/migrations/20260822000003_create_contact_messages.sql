-- Migration: Create contact_messages table for user inquiries and admin management
-- EGGU - Korean Egg Sandwich

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'UNREAD', -- 'UNREAD', 'READ', 'REPLIED', 'ARCHIVED'
  reply_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Index for searching and filtering
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_phone ON public.contact_messages(phone);

-- Apply updated_at trigger if handle_updated_at exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_updated_at') THEN
    CREATE TRIGGER set_updated_at_contact_messages
    BEFORE UPDATE ON public.contact_messages
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public / anon users to submit (insert) contact messages
CREATE POLICY "Allow public to insert contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Allow admin full access to view, update, and delete contact messages
CREATE POLICY "Allow admin full access to contact messages" ON public.contact_messages
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
