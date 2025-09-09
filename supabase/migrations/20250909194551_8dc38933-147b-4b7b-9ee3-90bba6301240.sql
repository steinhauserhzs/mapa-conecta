-- Check and fix all functions in public schema to have proper search_path
-- First, let's see what functions exist
SELECT proname as function_name, prosecdef as is_security_definer
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public';