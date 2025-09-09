-- Corrigir a RLS da tabela subscribers para maior segurança
DROP POLICY IF EXISTS "Edge functions can manage subscriptions" ON subscribers;
DROP POLICY IF EXISTS "Users can view their own subscription" ON subscribers;

-- Criar policies mais seguras para subscribers
CREATE POLICY "Users can view their own subscription" 
ON subscribers 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own subscription" 
ON subscribers 
FOR UPDATE 
USING (user_id = auth.uid());

-- Policy específica para edge functions com verificação de admin para operações sensíveis
CREATE POLICY "Admins can manage all subscriptions" 
ON subscribers 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE auth_user_id = auth.uid() 
    AND role = 'admin'
  )
);