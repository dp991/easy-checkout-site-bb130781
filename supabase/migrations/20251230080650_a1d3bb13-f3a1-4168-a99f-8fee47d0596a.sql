-- Completely disable RLS on wh_inquiries to allow all inserts
-- This is a temporary solution to verify the issue is with RLS policies
ALTER TABLE public.wh_inquiries DISABLE ROW LEVEL SECURITY;

-- Grant all necessary permissions
GRANT ALL ON public.wh_inquiries TO anon;
GRANT ALL ON public.wh_inquiries TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Force schema reload
NOTIFY pgrst, 'reload schema';