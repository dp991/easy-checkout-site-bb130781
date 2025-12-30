-- Force PostgREST to reload schema by notifying
NOTIFY pgrst, 'reload schema';