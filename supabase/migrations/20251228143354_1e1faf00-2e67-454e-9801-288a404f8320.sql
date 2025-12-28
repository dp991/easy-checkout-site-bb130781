-- Add parent_id column to wh_categories for hierarchical structure
ALTER TABLE public.wh_categories 
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.wh_categories(id) ON DELETE CASCADE;

-- Add index for faster parent lookups
CREATE INDEX IF NOT EXISTS idx_wh_categories_parent_id ON public.wh_categories(parent_id);