-- First drop all existing policies
DROP POLICY IF EXISTS "Anon can insert inquiries" ON public.wh_inquiries;
DROP POLICY IF EXISTS "Authenticated can insert inquiries" ON public.wh_inquiries;
DROP POLICY IF EXISTS "Admins can view all inquiries" ON public.wh_inquiries;
DROP POLICY IF EXISTS "Admins can update inquiries" ON public.wh_inquiries;
DROP POLICY IF EXISTS "Admins can delete inquiries" ON public.wh_inquiries;

-- Re-enable RLS
ALTER TABLE public.wh_inquiries ENABLE ROW LEVEL SECURITY;

-- Create a simple permissive INSERT policy for everyone
-- Using a single policy with both roles
CREATE POLICY "Allow insert for all users"
ON public.wh_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Admin SELECT policy
CREATE POLICY "Admins can view inquiries"
ON public.wh_inquiries
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin UPDATE policy  
CREATE POLICY "Admins can update inquiries"
ON public.wh_inquiries
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin DELETE policy
CREATE POLICY "Admins can delete inquiries"
ON public.wh_inquiries
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Force reload
NOTIFY pgrst, 'reload schema';