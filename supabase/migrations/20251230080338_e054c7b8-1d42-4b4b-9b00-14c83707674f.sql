-- Drop ALL existing policies on wh_inquiries
DROP POLICY IF EXISTS "Anyone can insert inquiries" ON public.wh_inquiries;
DROP POLICY IF EXISTS "Admins can view all inquiries" ON public.wh_inquiries;
DROP POLICY IF EXISTS "Admins can update inquiries" ON public.wh_inquiries;
DROP POLICY IF EXISTS "Admins can delete inquiries" ON public.wh_inquiries;

-- Temporarily disable RLS to ensure clean state
ALTER TABLE public.wh_inquiries DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE public.wh_inquiries ENABLE ROW LEVEL SECURITY;

-- Create INSERT policy that works for both anonymous and authenticated users
-- Using separate policies for each role to ensure proper application
CREATE POLICY "Anon can insert inquiries" 
ON public.wh_inquiries 
FOR INSERT 
TO anon
WITH CHECK (true);

CREATE POLICY "Authenticated can insert inquiries" 
ON public.wh_inquiries 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Recreate admin policies
CREATE POLICY "Admins can view all inquiries" 
ON public.wh_inquiries 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update inquiries" 
ON public.wh_inquiries 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete inquiries" 
ON public.wh_inquiries 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Force PostgREST to reload
NOTIFY pgrst, 'reload schema';