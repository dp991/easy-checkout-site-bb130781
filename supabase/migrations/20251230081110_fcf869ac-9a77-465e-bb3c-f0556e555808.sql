-- Disable RLS on wh_inquiries table
ALTER TABLE public.wh_inquiries DISABLE ROW LEVEL SECURITY;

-- Ensure permissions are granted
GRANT ALL ON public.wh_inquiries TO anon;
GRANT ALL ON public.wh_inquiries TO authenticated;