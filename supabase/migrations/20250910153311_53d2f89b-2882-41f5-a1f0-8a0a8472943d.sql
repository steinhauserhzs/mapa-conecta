-- Fix critical security vulnerability in profiles table
-- Remove any existing policies that might allow public access
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable" ON public.profiles;

-- Ensure RLS is enabled (should already be, but making sure)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to ensure they're restrictive
DROP POLICY IF EXISTS "admins_manage_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "users_select_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "users_insert_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "users_delete_own_profile" ON public.profiles;

-- Create secure policies that only allow authenticated access
-- Admins can manage all profiles
CREATE POLICY "admins_manage_all_profiles" ON public.profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.auth_user_id = auth.uid() 
      AND p.role = 'admin'::user_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.auth_user_id = auth.uid() 
      AND p.role = 'admin'::user_role
    )
  );

-- Users can only select their own profile
CREATE POLICY "users_select_own_profile" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

-- Users can only insert their own profile  
CREATE POLICY "users_insert_own_profile" ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth_user_id = auth.uid());

-- Users can only update their own profile
CREATE POLICY "users_update_own_profile" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- Users can only delete their own profile
CREATE POLICY "users_delete_own_profile" ON public.profiles
  FOR DELETE
  TO authenticated
  USING (auth_user_id = auth.uid());

-- Explicitly deny all access to anonymous users
CREATE POLICY "deny_anonymous_access" ON public.profiles
  FOR ALL
  TO anon
  USING (false);

-- Also secure other sensitive tables mentioned in security scan

-- Fix clients table
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "deny_anonymous_clients" ON public.clients;
CREATE POLICY "deny_anonymous_clients" ON public.clients
  FOR ALL
  TO anon
  USING (false);

-- Fix subscribers table  
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "deny_anonymous_subscribers" ON public.subscribers;
CREATE POLICY "deny_anonymous_subscribers" ON public.subscribers
  FOR ALL
  TO anon
  USING (false);

-- Fix transactions table
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "deny_anonymous_transactions" ON public.transactions;
CREATE POLICY "deny_anonymous_transactions" ON public.transactions
  FOR ALL
  TO anon
  USING (false);