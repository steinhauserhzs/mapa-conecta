-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('admin', 'user');

-- Create plan types enum
CREATE TYPE public.plan_type AS ENUM ('monthly', 'quarterly', 'yearly', 'credits');

-- Create map types enum
CREATE TYPE public.map_type AS ENUM ('personal', 'business', 'baby', 'marriage', 'phone', 'address', 'license_plate');

-- Create status enums
CREATE TYPE public.map_status AS ENUM ('draft', 'ready', 'archived');
CREATE TYPE public.subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  role user_role NOT NULL DEFAULT 'user',
  credits INTEGER NOT NULL DEFAULT 0,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create plans table
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type plan_type NOT NULL,
  price_cents INTEGER NOT NULL,
  maps_limit INTEGER,
  features JSONB NOT NULL DEFAULT '{}',
  stripe_price_id TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.plans(id) NOT NULL,
  status subscription_status NOT NULL DEFAULT 'trialing',
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create conversion tables
CREATE TABLE public.conversion_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'pt-BR',
  mapping JSONB NOT NULL DEFAULT '{}',
  normalization_rules JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN NOT NULL DEFAULT false,
  version INTEGER NOT NULL DEFAULT 1,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create calculation rules
CREATE TABLE public.calculation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  config JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN NOT NULL DEFAULT false,
  version INTEGER NOT NULL DEFAULT 1,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create report templates
CREATE TABLE public.report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type map_type NOT NULL,
  locale TEXT NOT NULL DEFAULT 'pt-BR',
  sections JSONB NOT NULL DEFAULT '{}',
  style JSONB NOT NULL DEFAULT '{}',
  cover_asset_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  version INTEGER NOT NULL DEFAULT 1,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create maps table
CREATE TABLE public.maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type map_type NOT NULL,
  title TEXT NOT NULL,
  status map_status NOT NULL DEFAULT 'draft',
  input JSONB NOT NULL DEFAULT '{}',
  result JSONB NOT NULL DEFAULT '{}',
  conversion_table_id UUID REFERENCES public.conversion_tables(id),
  calculation_rule_id UUID REFERENCES public.calculation_rules(id),
  report_template_id UUID REFERENCES public.report_templates(id),
  pdf_url TEXT,
  preview_html TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create map versions for history
CREATE TABLE public.map_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  map_id UUID REFERENCES public.maps(id) ON DELETE CASCADE NOT NULL,
  snapshot_input JSONB NOT NULL DEFAULT '{}',
  snapshot_result JSONB NOT NULL DEFAULT '{}',
  version INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create analyses table (for phone, address, license plate analyses)
CREATE TABLE public.analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  map_id UUID REFERENCES public.maps(id) ON DELETE CASCADE,
  type map_type NOT NULL,
  input JSONB NOT NULL DEFAULT '{}',
  result JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  stripe_payment_intent TEXT,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create assets table
CREATE TABLE public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversion_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.map_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth_user_id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for plans (public read, admin write)
CREATE POLICY "Anyone can view active plans" ON public.plans
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage plans" ON public.plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
  FOR SELECT USING (
    user_id = (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all subscriptions" ON public.subscriptions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for conversion tables
CREATE POLICY "Anyone can view default conversion tables" ON public.conversion_tables
  FOR SELECT USING (is_default = true);

CREATE POLICY "Users can view their own conversion tables" ON public.conversion_tables
  FOR SELECT USING (
    created_by = (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all conversion tables" ON public.conversion_tables
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for calculation rules
CREATE POLICY "Anyone can view default calculation rules" ON public.calculation_rules
  FOR SELECT USING (is_default = true);

CREATE POLICY "Users can view their own calculation rules" ON public.calculation_rules
  FOR SELECT USING (
    created_by = (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all calculation rules" ON public.calculation_rules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for report templates
CREATE POLICY "Anyone can view active templates" ON public.report_templates
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage all templates" ON public.report_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for maps
CREATE POLICY "Users can manage their own maps" ON public.maps
  FOR ALL USING (
    user_id = (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Admins can view all maps" ON public.maps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for map versions
CREATE POLICY "Users can view their own map versions" ON public.map_versions
  FOR SELECT USING (
    map_id IN (
      SELECT id FROM public.maps 
      WHERE user_id = (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
    )
  );

-- Create RLS policies for analyses
CREATE POLICY "Users can manage their own analyses" ON public.analyses
  FOR ALL USING (
    user_id = (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
  );

-- Create RLS policies for transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (
    user_id = (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Admins can view all transactions" ON public.transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for assets
CREATE POLICY "Users can manage their own assets" ON public.assets
  FOR ALL USING (
    user_id = (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()) OR
    user_id IS NULL
  );

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (auth_user_id, email, name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    CASE 
      WHEN new.email = 'steinhauser.haira@gmail.com' THEN 'admin'::user_role
      ELSE 'user'::user_role
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maps_updated_at
  BEFORE UPDATE ON public.maps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default conversion table (PT-BR Cabalística)
INSERT INTO public.conversion_tables (name, locale, mapping, normalization_rules, is_default) VALUES (
  'Cabalística Português BR',
  'pt-BR',
  '{
    "A": 1, "Á": 1, "À": 1, "Ã": 1, "Â": 1,
    "B": 2,
    "C": 3, "Ç": 3,
    "D": 4,
    "E": 5, "É": 5, "Ê": 5,
    "F": 6,
    "G": 7,
    "H": 8,
    "I": 9, "Í": 9,
    "J": 1,
    "K": 2,
    "L": 3,
    "M": 4,
    "N": 5,
    "O": 6, "Ó": 6, "Ô": 6, "Õ": 6,
    "P": 7,
    "Q": 8,
    "R": 9,
    "S": 1,
    "T": 2,
    "U": 3, "Ú": 3,
    "V": 4,
    "W": 5,
    "X": 6,
    "Y": 7,
    "Z": 8
  }',
  '{
    "remove_accents": false,
    "normalize_spaces": true,
    "uppercase": true,
    "vowels": ["A", "E", "I", "O", "U"],
    "consonants": ["B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "V", "W", "X", "Y", "Z"]
  }',
  true
);

-- Insert default calculation rules
INSERT INTO public.calculation_rules (name, description, config, is_default) VALUES (
  'Regras Cabalísticas Padrão',
  'Configuração padrão da numerologia cabalística com números mestres e dívidas kármicas',
  '{
    "masters": [11, 22, 33],
    "karmic_debts": [13, 14, 16, 19],
    "reduction_type": "cabalistic",
    "include_yod": true,
    "preserve_masters_in_reduction": true,
    "karmic_detection_mode": "path_and_result"
  }',
  true
);

-- Insert default plans
INSERT INTO public.plans (name, type, price_cents, maps_limit, features, active) VALUES 
('Plano Mensal', 'monthly', 2999, 50, '{"pdf_export": true, "custom_templates": false, "priority_support": false}', true),
('Plano Trimestral', 'quarterly', 7999, 150, '{"pdf_export": true, "custom_templates": true, "priority_support": false}', true),
('Plano Anual', 'yearly', 29999, 600, '{"pdf_export": true, "custom_templates": true, "priority_support": true}', true),
('Pacote 10 Mapas', 'credits', 1999, 10, '{"pdf_export": true, "custom_templates": false, "priority_support": false}', true);

-- Insert default report templates
INSERT INTO public.report_templates (name, type, locale, sections, style, active) VALUES 
('Template Mapa Pessoal', 'personal', 'pt-BR', 
'{"cover": {"title": "Mapa Numerológico Pessoal", "subtitle": "Análise Cabalística Completa"}, "sections": ["dados_pessoais", "numeros_essenciais", "alma", "personalidade", "expressao", "destino", "maturidade", "dividas_karmicas", "ciclos_vida", "pinoculos", "desafios", "planos_expressao", "tabela_inclusao", "numeros_ausentes", "ciclos_temporais"]}',
'{"colors": {"primary": "#6B46C1", "secondary": "#EC4899", "accent": "#F59E0B"}, "fonts": {"title": "serif", "body": "sans-serif"}}',
true),
('Template Mapa Empresarial', 'business', 'pt-BR',
'{"cover": {"title": "Mapa Numerológico Empresarial", "subtitle": "Análise da Energia da Marca"}, "sections": ["dados_empresa", "numeros_essenciais", "energia_nome", "vibracao_abertura", "ciclos_empresa", "compatibilidade_socios"]}',
'{"colors": {"primary": "#059669", "secondary": "#DC2626", "accent": "#D97706"}, "fonts": {"title": "serif", "body": "sans-serif"}}',
true);