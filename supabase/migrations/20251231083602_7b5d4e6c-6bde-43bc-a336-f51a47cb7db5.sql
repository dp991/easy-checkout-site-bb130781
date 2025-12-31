-- Add new JSONB columns for structured product specifications
ALTER TABLE public.wh_products 
ADD COLUMN IF NOT EXISTS packaging_info jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS lead_times jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS customizations jsonb DEFAULT '[]'::jsonb;