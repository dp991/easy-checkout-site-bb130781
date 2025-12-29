-- Add is_read field to wh_inquiries table
ALTER TABLE public.wh_inquiries 
ADD COLUMN IF NOT EXISTS is_read boolean DEFAULT false;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_wh_inquiries_is_read ON public.wh_inquiries(is_read);
CREATE INDEX IF NOT EXISTS idx_wh_inquiries_created_at ON public.wh_inquiries(created_at DESC);