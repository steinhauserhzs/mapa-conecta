-- Limpar planos existentes e criar plano único
DELETE FROM public.plans;

-- Inserir plano único de R$ 35,00/mês
INSERT INTO public.plans (name, type, price_cents, maps_limit, features, active, stripe_price_id)
VALUES (
  'Plano Premium',
  'monthly',
  3500, -- R$ 35,00 em centavos
  NULL, -- Sem limite de mapas
  '{"unlimited_maps": true, "all_features": true, "priority_support": true, "pdf_export": true}',
  true,
  NULL -- Será preenchido com o price_id do Stripe
);

-- Remover sistema de créditos - simplificar profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS credits;

-- Criar tabela de assinantes para controle simplificado
CREATE TABLE IF NOT EXISTS public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email text NOT NULL UNIQUE,
  stripe_customer_id text,
  subscribed boolean NOT NULL DEFAULT false,
  subscription_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela subscribers
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Políticas para subscribers
CREATE POLICY "Users can view their own subscription" 
ON public.subscribers
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Edge functions can manage subscriptions" 
ON public.subscribers
FOR ALL 
USING (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_subscribers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscribers_updated_at
  BEFORE UPDATE ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_subscribers_updated_at();