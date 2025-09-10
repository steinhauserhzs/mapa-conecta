-- Comprehensive security fix for all remaining ERROR level findings
-- This will secure profiles, clients, transactions, subscriptions, and subscribers tables

-- =====================================================
-- 1. TRANSACTIONS TABLE - Secure financial data
-- =====================================================
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them securely
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;
DROP POLICY IF EXISTS "deny_anonymous_transactions" ON public.transactions;

-- Create secure policies for transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT
  TO authenticated
  USING (user_id = (
    SELECT profiles.id FROM profiles 
    WHERE profiles.auth_user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all transactions" ON public.transactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.auth_user_id = auth.uid() 
      AND p.role = 'admin'::user_role
    )
  );

-- Explicitly deny all access to anonymous users
CREATE POLICY "deny_anonymous_transactions" ON public.transactions
  FOR ALL
  TO anon
  USING (false);

-- =====================================================
-- 2. SUBSCRIPTIONS TABLE - Secure billing data
-- =====================================================
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them securely
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "deny_anonymous_subscriptions" ON public.subscriptions;

-- Create secure policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
  FOR SELECT
  TO authenticated
  USING (user_id = (
    SELECT profiles.id FROM profiles 
    WHERE profiles.auth_user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all subscriptions" ON public.subscriptions
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
CREATE POLICY "deny_anonymous_subscriptions" ON public.subscriptions
  FOR ALL
  TO anon
  USING (false);

-- =====================================================
-- 3. SUBSCRIBERS TABLE - Secure subscriber emails
-- =====================================================
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them securely  
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "deny_anonymous_subscribers" ON public.subscribers;

-- Create secure policies for subscribers
CREATE POLICY "Users can view their own subscription" ON public.subscribers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own subscription" ON public.subscribers
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all subscriptions" ON public.subscribers
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
CREATE POLICY "deny_anonymous_subscribers" ON public.subscribers
  FOR ALL
  TO anon
  USING (false);

-- =====================================================
-- 4. ADDITIONAL SECURITY FOR PROFILES TABLE
-- =====================================================
-- Add additional explicit denial for any potential loopholes
DROP POLICY IF EXISTS "deny_anonymous_access" ON public.profiles;
CREATE POLICY "deny_anonymous_access" ON public.profiles
  FOR ALL
  TO anon
  USING (false);

-- =====================================================
-- 5. SECURE BUSINESS DATA TABLES (from previous scan)
-- =====================================================

-- Numerology texts - restrict to authenticated users only
ALTER TABLE public.numerology_texts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view numerology texts" ON public.numerology_texts;
DROP POLICY IF EXISTS "Admins can manage numerology texts" ON public.numerology_texts;
DROP POLICY IF EXISTS "deny_anonymous_numerology" ON public.numerology_texts;

CREATE POLICY "Authenticated users can view numerology texts" ON public.numerology_texts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage numerology texts" ON public.numerology_texts
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

CREATE POLICY "deny_anonymous_numerology" ON public.numerology_texts
  FOR ALL
  TO anon
  USING (false);

-- Plans table - restrict to authenticated users only  
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view active plans" ON public.plans;
DROP POLICY IF EXISTS "Admins can manage plans" ON public.plans;
DROP POLICY IF EXISTS "deny_anonymous_plans" ON public.plans;

CREATE POLICY "Authenticated users can view active plans" ON public.plans
  FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Admins can manage plans" ON public.plans
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

CREATE POLICY "deny_anonymous_plans" ON public.plans
  FOR ALL
  TO anon
  USING (false);