-- Drop the restrictive policy and recreate as permissive
DROP POLICY IF EXISTS "Anyone can insert inquiries" ON public.wh_inquiries;

-- Create a new PERMISSIVE policy for inserting inquiries (default is permissive)
CREATE POLICY "Anyone can insert inquiries" 
ON public.wh_inquiries 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);