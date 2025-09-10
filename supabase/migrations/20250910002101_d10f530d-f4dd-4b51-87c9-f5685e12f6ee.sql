-- Melhorias de segurança para a tabela profiles
-- Garantir que as políticas RLS sejam mais explícitas e seguras

-- Primeiro, vamos remover as políticas existentes e recriar com verificações mais robustas
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage profiles" ON public.profiles;

-- Criar políticas mais seguras e explícitas

-- 1. Política SELECT: Usuários só podem ver seu próprio perfil
CREATE POLICY "users_select_own_profile" ON public.profiles
  FOR SELECT 
  TO authenticated
  USING (
    auth_user_id = auth.uid() 
    AND auth.uid() IS NOT NULL
  );

-- 2. Política UPDATE: Usuários só podem atualizar seu próprio perfil
CREATE POLICY "users_update_own_profile" ON public.profiles
  FOR UPDATE 
  TO authenticated
  USING (
    auth_user_id = auth.uid() 
    AND auth.uid() IS NOT NULL
  )
  WITH CHECK (
    auth_user_id = auth.uid() 
    AND auth.uid() IS NOT NULL
  );

-- 3. Política INSERT: Usuários só podem inserir seu próprio perfil
CREATE POLICY "users_insert_own_profile" ON public.profiles
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    auth_user_id = auth.uid() 
    AND auth.uid() IS NOT NULL
  );

-- 4. Política DELETE: Usuários podem deletar seu próprio perfil
CREATE POLICY "users_delete_own_profile" ON public.profiles
  FOR DELETE 
  TO authenticated
  USING (
    auth_user_id = auth.uid() 
    AND auth.uid() IS NOT NULL
  );

-- 5. Política para administradores: Acesso total apenas para admins
CREATE POLICY "admins_manage_all_profiles" ON public.profiles
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.auth_user_id = auth.uid() 
      AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.auth_user_id = auth.uid() 
      AND p.role = 'admin'
    )
  );

-- Adicionar comentários para documentar as políticas
COMMENT ON POLICY "users_select_own_profile" ON public.profiles IS 
  'Permite que usuários autenticados vejam apenas seu próprio perfil, incluindo email';

COMMENT ON POLICY "users_update_own_profile" ON public.profiles IS 
  'Permite que usuários autenticados atualizem apenas seu próprio perfil';

COMMENT ON POLICY "users_insert_own_profile" ON public.profiles IS 
  'Permite que usuários autenticados criem apenas seu próprio perfil';

COMMENT ON POLICY "users_delete_own_profile" ON public.profiles IS 
  'Permite que usuários autenticados deletem apenas seu próprio perfil';

COMMENT ON POLICY "admins_manage_all_profiles" ON public.profiles IS 
  'Permite que administradores gerenciem todos os perfis';

-- Garantir que RLS está habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Adicionar índice para melhor performance nas consultas de autenticação
CREATE INDEX IF NOT EXISTS idx_profiles_auth_user_id ON public.profiles(auth_user_id);

-- Garantir que auth_user_id não pode ser nulo (segurança adicional)
ALTER TABLE public.profiles ALTER COLUMN auth_user_id SET NOT NULL;