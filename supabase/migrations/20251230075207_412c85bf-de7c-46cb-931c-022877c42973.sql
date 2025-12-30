-- Temporarily disable RLS, then re-enable to force refresh
ALTER TABLE public.wh_inquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.wh_inquiries ENABLE ROW LEVEL SECURITY;

-- Also grant usage to anon role explicitly
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON public.wh_inquiries TO anon;
GRANT INSERT ON public.wh_inquiries TO authenticated;