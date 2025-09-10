-- Fix remaining security issue with clients table public access
-- The clients table should only be accessible by authenticated users who own the client records

-- Ensure RLS is enabled on clients table
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Remove any policies that might allow public access
DROP POLICY IF EXISTS "Allow public read access to clients" ON public.clients;
DROP POLICY IF EXISTS "Public clients are viewable" ON public.clients;

-- Recreate existing policies to ensure they're secure
DROP POLICY IF EXISTS "Users can view their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can create their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can update their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can delete their own clients" ON public.clients;
DROP POLICY IF EXISTS "deny_anonymous_clients" ON public.clients;

-- Create secure policies for clients table
-- Users can view only their own client records
CREATE POLICY "Users can view their own clients" ON public.clients
  FOR SELECT
  TO authenticated
  USING (user_id = (
    SELECT profiles.id FROM profiles 
    WHERE profiles.auth_user_id = auth.uid()
  ));

-- Users can create client records for themselves
CREATE POLICY "Users can create their own clients" ON public.clients
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (
    SELECT profiles.id FROM profiles 
    WHERE profiles.auth_user_id = auth.uid()
  ));

-- Users can update only their own client records
CREATE POLICY "Users can update their own clients" ON public.clients
  FOR UPDATE
  TO authenticated
  USING (user_id = (
    SELECT profiles.id FROM profiles 
    WHERE profiles.auth_user_id = auth.uid()
  ))
  WITH CHECK (user_id = (
    SELECT profiles.id FROM profiles 
    WHERE profiles.auth_user_id = auth.uid()
  ));

-- Users can delete only their own client records
CREATE POLICY "Users can delete their own clients" ON public.clients
  FOR DELETE
  TO authenticated
  USING (user_id = (
    SELECT profiles.id FROM profiles 
    WHERE profiles.auth_user_id = auth.uid()
  ));

-- Admins can manage all client records
CREATE POLICY "Admins can manage all clients" ON public.clients
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

-- Explicitly deny all access to anonymous users
CREATE POLICY "deny_anonymous_clients" ON public.clients
  FOR ALL
  TO anon
  USING (false);