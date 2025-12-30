-- Drop the incorrect policy
DROP POLICY IF EXISTS "Anyone can insert inquiries" ON public.wh_inquiries;

-- Create policy with correct Supabase roles (anon for anonymous, authenticated for logged-in users)
CREATE POLICY "Anyone can insert inquiries" 
ON public.wh_inquiries 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);