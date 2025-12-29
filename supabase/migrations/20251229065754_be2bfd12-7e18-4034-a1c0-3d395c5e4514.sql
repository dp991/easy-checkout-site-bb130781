-- Add indexes to wh_inquiries table for better performance
CREATE INDEX IF NOT EXISTS idx_wh_inquiries_created_at ON public.wh_inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wh_inquiries_is_read ON public.wh_inquiries (is_read);
CREATE INDEX IF NOT EXISTS idx_wh_inquiries_status ON public.wh_inquiries (status);

-- Add index for products sorting by updated_at
CREATE INDEX IF NOT EXISTS idx_wh_products_updated_at ON public.wh_products (updated_at DESC);