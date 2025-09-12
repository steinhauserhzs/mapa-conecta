-- Corrigir erro de recursão infinita nas políticas RLS da tabela profiles
-- O erro ocorre quando uma política tenta referenciar a própria tabela profiles de forma recursiva

-- Remover políticas problemáticas
DROP POLICY IF EXISTS "admins_manage_all_profiles" ON profiles;
DROP POLICY IF EXISTS "users_select_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_delete_own_profile" ON profiles;

-- Criar políticas RLS corretas e seguras
CREATE POLICY "users_select_own_profile" ON profiles 
FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "users_insert_own_profile" ON profiles 
FOR INSERT WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "users_update_own_profile" ON profiles 
FOR UPDATE USING (auth_user_id = auth.uid()) 
WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "users_delete_own_profile" ON profiles 
FOR DELETE USING (auth_user_id = auth.uid());

-- Política para admins (sem recursão)
CREATE POLICY "admins_manage_all_profiles" ON profiles 
FOR ALL USING (
  auth.jwt() ->> 'email' = 'steinhauser.haira@gmail.com'
) WITH CHECK (
  auth.jwt() ->> 'email' = 'steinhauser.haira@gmail.com'
);