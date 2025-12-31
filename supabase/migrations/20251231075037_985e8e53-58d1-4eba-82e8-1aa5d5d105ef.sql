-- Add new fields for enhanced product management
-- 1. attributes: Array of key-value pairs for dynamic product attributes
-- 2. supplier: JSONB for supplier information
-- 3. description_html_zh: Rich text HTML content in Chinese
-- 4. description_html_en: Rich text HTML content in English

ALTER TABLE public.wh_products 
ADD COLUMN IF NOT EXISTS attributes jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS supplier jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS description_html_zh text,
ADD COLUMN IF NOT EXISTS description_html_en text;

-- Add comment for documentation
COMMENT ON COLUMN public.wh_products.attributes IS 'Dynamic product attributes array: [{key, value, is_key_attribute, group}]';
COMMENT ON COLUMN public.wh_products.supplier IS 'Supplier info: {name, location, type, years, verified, logo_url, certifications}';
COMMENT ON COLUMN public.wh_products.description_html_zh IS 'Rich text product description in Chinese (HTML)';
COMMENT ON COLUMN public.wh_products.description_html_en IS 'Rich text product description in English (HTML)';