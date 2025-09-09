-- Create security definer function to avoid recursive policy
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE auth_user_id = auth.uid() AND role = 'admin'
  );
$$;

-- Replace recursive policy on profiles
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Admins can view all profiles'
  ) THEN
    DROP POLICY "Admins can view all profiles" ON public.profiles;
  END IF;
END $$;

-- Create a new admin policy using function (broad manage)
CREATE POLICY "Admins can manage profiles"
ON public.profiles
FOR ALL
USING (public.is_admin());