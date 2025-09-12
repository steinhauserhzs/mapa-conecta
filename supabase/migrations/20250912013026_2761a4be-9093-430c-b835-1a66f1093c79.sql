-- Expandir tabela numerology_texts para suportar estrutura completa
-- Adicionar novas colunas para metadados e categorização avançada

ALTER TABLE public.numerology_texts 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'main',
ADD COLUMN IF NOT EXISTS subcategory TEXT,
ADD COLUMN IF NOT EXISTS color_associations TEXT[],
ADD COLUMN IF NOT EXISTS stone_associations TEXT[],
ADD COLUMN IF NOT EXISTS profession_associations TEXT[],
ADD COLUMN IF NOT EXISTS health_associations TEXT[],
ADD COLUMN IF NOT EXISTS keywords TEXT[],
ADD COLUMN IF NOT EXISTS angel_name TEXT,
ADD COLUMN IF NOT EXISTS angel_category TEXT,
ADD COLUMN IF NOT EXISTS angel_invocation_time TEXT,
ADD COLUMN IF NOT EXISTS angel_psalm TEXT,
ADD COLUMN IF NOT EXISTS is_master_number BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0;

-- Criar tabela para anjos cabalísticos
CREATE TABLE IF NOT EXISTS public.cabalistic_angels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  domain_description TEXT NOT NULL,
  invocation_time_1 TEXT,
  invocation_time_2 TEXT,
  psalm_reference TEXT,
  negative_influence TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS para tabela de anjos
ALTER TABLE public.cabalistic_angels ENABLE ROW LEVEL SECURITY;

-- Política para anjos - todos usuários autenticados podem visualizar
CREATE POLICY "Authenticated users can view cabalistic angels" 
ON public.cabalistic_angels 
FOR SELECT 
USING (TRUE);

-- Política para anjos - apenas admins podem gerenciar
CREATE POLICY "Admins can manage cabalistic angels" 
ON public.cabalistic_angels 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles p
  WHERE p.auth_user_id = auth.uid() 
  AND p.role = 'admin'::user_role
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles p
  WHERE p.auth_user_id = auth.uid() 
  AND p.role = 'admin'::user_role
));

-- Criar tabela para compatibilidade amorosa
CREATE TABLE IF NOT EXISTS public.love_compatibility (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number_1 INTEGER NOT NULL,
  number_2 INTEGER NOT NULL,
  compatibility_text TEXT NOT NULL,
  compatibility_score INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(number_1, number_2)
);

-- Enable RLS para compatibilidade
ALTER TABLE public.love_compatibility ENABLE ROW LEVEL SECURITY;

-- Política para compatibilidade - todos usuários autenticados podem visualizar
CREATE POLICY "Authenticated users can view love compatibility" 
ON public.love_compatibility 
FOR SELECT 
USING (TRUE);

-- Política para compatibilidade - apenas admins podem gerenciar
CREATE POLICY "Admins can manage love compatibility" 
ON public.love_compatibility 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles p
  WHERE p.auth_user_id = auth.uid() 
  AND p.role = 'admin'::user_role
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles p
  WHERE p.auth_user_id = auth.uid() 
  AND p.role = 'admin'::user_role
));

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_numerology_texts_section_key ON public.numerology_texts(section, key_number);
CREATE INDEX IF NOT EXISTS idx_numerology_texts_category ON public.numerology_texts(category);
CREATE INDEX IF NOT EXISTS idx_cabalistic_angels_name ON public.cabalistic_angels(name);
CREATE INDEX IF NOT EXISTS idx_love_compatibility_numbers ON public.love_compatibility(number_1, number_2);

-- Atualizar versão para v3.0 - conteúdo completo
UPDATE public.numerology_texts SET version = 'v3.0' WHERE version = 'v2.0';