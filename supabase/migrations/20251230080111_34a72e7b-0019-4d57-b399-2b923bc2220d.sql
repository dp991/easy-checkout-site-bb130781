-- Force PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- Recreate the policy to ensure it's applied correctly
DROP POLICY IF EXISTS "Anyone can insert inquiries" ON public.wh_inquiries;

CREATE POLICY "Anyone can insert inquiries" 
ON public.wh_inquiries 
FOR INSERT 
TO public
WITH CHECK (true);