-- Drop the restrictive insert policy
DROP POLICY IF EXISTS "Anyone can create inquiries" ON public.wh_inquiries;

-- Create a permissive insert policy instead
CREATE POLICY "Anyone can create inquiries" 
ON public.wh_inquiries 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);