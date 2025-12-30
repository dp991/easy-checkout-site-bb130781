-- Enable Row Level Security on wh_inquiries table
-- This table contains sensitive customer data (emails, phone numbers, companies, messages)
-- RLS must be enabled to protect this data

ALTER TABLE public.wh_inquiries ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owner as well (extra security measure)
ALTER TABLE public.wh_inquiries FORCE ROW LEVEL SECURITY;