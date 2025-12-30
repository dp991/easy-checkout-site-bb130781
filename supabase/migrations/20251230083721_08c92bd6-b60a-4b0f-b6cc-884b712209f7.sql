-- Add is_read column to wh_inquiries table
ALTER TABLE public.wh_inquiries 
ADD COLUMN is_read boolean DEFAULT false;