-- Add and remove a dummy column to force PostgREST cache invalidation
ALTER TABLE public.wh_inquiries ADD COLUMN IF NOT EXISTS _temp_column boolean;
ALTER TABLE public.wh_inquiries DROP COLUMN IF EXISTS _temp_column;

-- Also try a different approach: recreate the insert policy with explicit PERMISSIVE keyword
DROP POLICY IF EXISTS "Allow insert for all users" ON public.wh_inquiries;

CREATE POLICY "Allow insert for all users"
ON public.wh_inquiries
AS PERMISSIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Send multiple reload signals
SELECT pg_notify('pgrst', 'reload schema');
SELECT pg_notify('pgrst', 'reload config');