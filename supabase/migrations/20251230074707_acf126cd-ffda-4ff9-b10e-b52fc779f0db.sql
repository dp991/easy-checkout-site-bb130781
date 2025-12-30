-- Drop all existing policies on wh_inquiries
DROP POLICY IF EXISTS "Admins can manage inquiries" ON public.wh_inquiries;
DROP POLICY IF EXISTS "Admins can view all inquiries" ON public.wh_inquiries;
DROP POLICY IF EXISTS "Anyone can create inquiries" ON public.wh_inquiries;

-- Create proper PERMISSIVE policies with public role for anonymous access
CREATE POLICY "Anyone can insert inquiries" 
ON public.wh_inquiries 
FOR INSERT 
TO public
WITH CHECK (true);

-- Admin policies for SELECT, UPDATE, DELETE
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