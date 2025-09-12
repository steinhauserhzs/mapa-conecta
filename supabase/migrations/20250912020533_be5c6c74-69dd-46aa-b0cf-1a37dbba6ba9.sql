-- FASE 2: REESTRUTURAÇÃO COMPLETA DA BASE DE DADOS
-- Expandir numerology_texts para conteúdo rico e detalhado

-- Adicionar campos para conteúdo profissional expandido
ALTER TABLE numerology_texts 
ADD COLUMN IF NOT EXISTS content_length INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS practical_guidance TEXT,
ADD COLUMN IF NOT EXISTS psychological_analysis TEXT,
ADD COLUMN IF NOT EXISTS recommendations TEXT,
ADD COLUMN IF NOT EXISTS examples TEXT,
ADD COLUMN IF NOT EXISTS warnings TEXT,
ADD COLUMN IF NOT EXISTS affirmations TEXT,
ADD COLUMN IF NOT EXISTS meditation_guide TEXT,
ADD COLUMN IF NOT EXISTS compatibility_notes TEXT,
ADD COLUMN IF NOT EXISTS professional_applications TEXT,
ADD COLUMN IF NOT EXISTS spiritual_aspects TEXT,
ADD COLUMN IF NOT EXISTS numerological_formula TEXT,
ADD COLUMN IF NOT EXISTS calculation_details TEXT,
ADD COLUMN IF NOT EXISTS historical_context TEXT,
ADD COLUMN IF NOT EXISTS celebrity_examples TEXT,
ADD COLUMN IF NOT EXISTS therapeutic_approach TEXT,
ADD COLUMN IF NOT EXISTS energy_description TEXT,
ADD COLUMN IF NOT EXISTS chakra_associations TEXT,
ADD COLUMN IF NOT EXISTS tarot_connections TEXT,
ADD COLUMN IF NOT EXISTS seasonal_influences TEXT,
ADD COLUMN IF NOT EXISTS life_periods TEXT,
ADD COLUMN IF NOT EXISTS career_guidance TEXT,
ADD COLUMN IF NOT EXISTS relationship_advice TEXT,
ADD COLUMN IF NOT EXISTS health_recommendations TEXT,
ADD COLUMN IF NOT EXISTS financial_tendencies TEXT,
ADD COLUMN IF NOT EXISTS spiritual_mission TEXT,
ADD COLUMN IF NOT EXISTS karmic_lessons_detail TEXT,
ADD COLUMN IF NOT EXISTS growth_opportunities TEXT,
ADD COLUMN IF NOT EXISTS shadow_aspects TEXT,
ADD COLUMN IF NOT EXISTS integration_practices TEXT,
ADD COLUMN IF NOT EXISTS page_section TEXT DEFAULT 'main',
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS template_type TEXT DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS formatting_rules JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS cross_references TEXT[],
ADD COLUMN IF NOT EXISTS bibliography TEXT,
ADD COLUMN IF NOT EXISTS author_notes TEXT;

-- Criar tabela para profissões detalhadas por número
CREATE TABLE IF NOT EXISTS profession_guidance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number INTEGER NOT NULL,
  profession_category TEXT NOT NULL,
  profession_name TEXT NOT NULL,
  detailed_description TEXT NOT NULL,
  success_factors TEXT,
  challenges TEXT,
  recommended_skills TEXT[],
  work_environment TEXT,
  leadership_style TEXT,
  collaboration_approach TEXT,
  entrepreneurial_potential TEXT,
  salary_expectations TEXT,
  growth_trajectory TEXT,
  industry_examples TEXT[],
  famous_professionals TEXT[],
  avoid_roles TEXT[],
  ideal_companies TEXT[],
  freelance_potential TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para saúde e bem-estar detalhado
CREATE TABLE IF NOT EXISTS health_wellness_guidance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number INTEGER NOT NULL,
  body_system TEXT NOT NULL,
  health_tendencies TEXT NOT NULL,
  preventive_measures TEXT,
  recommended_exercises TEXT[],
  dietary_suggestions TEXT,
  stress_management TEXT,
  sleep_patterns TEXT,
  energy_cycles TEXT,
  emotional_health TEXT,
  mental_clarity TEXT,
  spiritual_practices TEXT[],
  healing_modalities TEXT[],
  warning_signs TEXT[],
  lifestyle_adjustments TEXT,
  supplements_herbs TEXT[],
  medical_checkups TEXT,
  holistic_approaches TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para correspondências completas (cores, pedras, etc.)
CREATE TABLE IF NOT EXISTS numerology_correspondences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number INTEGER NOT NULL,
  correspondence_type TEXT NOT NULL, -- 'color', 'stone', 'metal', 'planet', 'element', 'flower', 'fragrance'
  name TEXT NOT NULL,
  hex_color TEXT, -- para cores
  properties TEXT NOT NULL,
  usage_instructions TEXT,
  spiritual_meaning TEXT,
  therapeutic_benefits TEXT,
  combination_suggestions TEXT[],
  acquisition_tips TEXT,
  care_instructions TEXT,
  historical_significance TEXT,
  cultural_associations TEXT,
  scientific_properties TEXT,
  chakra_alignment TEXT,
  astrological_connection TEXT,
  seasonal_timing TEXT,
  ritual_applications TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Expandir tabela de compatibilidade amorosa
ALTER TABLE love_compatibility
ADD COLUMN IF NOT EXISTS detailed_analysis TEXT,
ADD COLUMN IF NOT EXISTS relationship_dynamics TEXT,
ADD COLUMN IF NOT EXISTS communication_style TEXT,
ADD COLUMN IF NOT EXISTS conflict_resolution TEXT,
ADD COLUMN IF NOT EXISTS intimacy_patterns TEXT,
ADD COLUMN IF NOT EXISTS growth_potential TEXT,
ADD COLUMN IF NOT EXISTS challenges_solutions TEXT,
ADD COLUMN IF NOT EXISTS long_term_outlook TEXT,
ADD COLUMN IF NOT EXISTS marriage_potential TEXT,
ADD COLUMN IF NOT EXISTS parenting_style TEXT,
ADD COLUMN IF NOT EXISTS financial_compatibility TEXT,
ADD COLUMN IF NOT EXISTS social_dynamics TEXT,
ADD COLUMN IF NOT EXISTS spiritual_connection TEXT,
ADD COLUMN IF NOT EXISTS energy_exchange TEXT,
ADD COLUMN IF NOT EXISTS karmic_relationship TEXT,
ADD COLUMN IF NOT EXISTS past_life_connections TEXT,
ADD COLUMN IF NOT EXISTS soul_lessons TEXT,
ADD COLUMN IF NOT EXISTS healing_opportunities TEXT,
ADD COLUMN IF NOT EXISTS red_flags TEXT[],
ADD COLUMN IF NOT EXISTS success_strategies TEXT[],
ADD COLUMN IF NOT EXISTS ideal_date_ideas TEXT[],
ADD COLUMN IF NOT EXISTS gift_suggestions TEXT[],
ADD COLUMN IF NOT EXISTS relationship_milestones TEXT;

-- Expandir tabela de anjos cabalísticos
ALTER TABLE cabalistic_angels
ADD COLUMN IF NOT EXISTS detailed_invocation TEXT,
ADD COLUMN IF NOT EXISTS complete_prayer TEXT,
ADD COLUMN IF NOT EXISTS ritual_instructions TEXT,
ADD COLUMN IF NOT EXISTS offering_suggestions TEXT[],
ADD COLUMN IF NOT EXISTS sacred_geometry TEXT,
ADD COLUMN IF NOT EXISTS color_correspondences TEXT[],
ADD COLUMN IF NOT EXISTS incense_oils TEXT[],
ADD COLUMN IF NOT EXISTS lunar_timing TEXT,
ADD COLUMN IF NOT EXISTS planetary_hours TEXT,
ADD COLUMN IF NOT EXISTS crystal_associations TEXT[],
ADD COLUMN IF NOT EXISTS biblical_references TEXT,
ADD COLUMN IF NOT EXISTS historical_accounts TEXT,
ADD COLUMN IF NOT EXISTS miracle_stories TEXT,
ADD COLUMN IF NOT EXISTS protection_methods TEXT,
ADD COLUMN IF NOT EXISTS healing_specialties TEXT[],
ADD COLUMN IF NOT EXISTS manifestation_areas TEXT[],
ADD COLUMN IF NOT EXISTS signs_presence TEXT[],
ADD COLUMN IF NOT EXISTS communication_methods TEXT[],
ADD COLUMN IF NOT EXISTS gratitude_practices TEXT,
ADD COLUMN IF NOT EXISTS integration_daily_life TEXT;

-- Criar tabela para templates de seções do mapa
CREATE TABLE IF NOT EXISTS map_section_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name TEXT NOT NULL,
  section_type TEXT NOT NULL, -- 'header', 'introduction', 'core_numbers', 'detailed_analysis', 'predictions', 'recommendations'
  title TEXT NOT NULL,
  subtitle TEXT,
  content_structure JSONB NOT NULL DEFAULT '{}',
  styling_rules JSONB NOT NULL DEFAULT '{}',
  page_break_before BOOLEAN DEFAULT false,
  page_break_after BOOLEAN DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  required_data TEXT[] DEFAULT '{}',
  conditional_display JSONB DEFAULT '{}',
  formatting_instructions TEXT,
  professional_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para períodos planetários e ciclos especiais
CREATE TABLE IF NOT EXISTS planetary_periods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  period_name TEXT NOT NULL,
  planet TEXT NOT NULL,
  number_association INTEGER NOT NULL,
  age_range_start INTEGER NOT NULL,
  age_range_end INTEGER NOT NULL,
  general_influence TEXT NOT NULL,
  life_themes TEXT[],
  opportunities TEXT[],
  challenges TEXT[],
  recommended_actions TEXT[],
  spiritual_lessons TEXT[],
  career_focus TEXT,
  relationship_patterns TEXT,
  health_considerations TEXT,
  financial_tendencies TEXT,
  personal_development TEXT,
  shadow_work TEXT,
  integration_practices TEXT[],
  famous_examples TEXT[],
  historical_context TEXT,
  astrological_connections TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_numerology_texts_section_number ON numerology_texts(section, key_number);
CREATE INDEX IF NOT EXISTS idx_numerology_texts_version_lang ON numerology_texts(version, lang);
CREATE INDEX IF NOT EXISTS idx_profession_guidance_number ON profession_guidance(number);
CREATE INDEX IF NOT EXISTS idx_health_wellness_number ON health_wellness_guidance(number);
CREATE INDEX IF NOT EXISTS idx_correspondences_number_type ON numerology_correspondences(number, correspondence_type);
CREATE INDEX IF NOT EXISTS idx_love_compatibility_numbers ON love_compatibility(number_1, number_2);
CREATE INDEX IF NOT EXISTS idx_planetary_periods_age ON planetary_periods(age_range_start, age_range_end);
CREATE INDEX IF NOT EXISTS idx_map_templates_type_order ON map_section_templates(section_type, display_order);

-- Habilitar RLS para todas as novas tabelas
ALTER TABLE profession_guidance ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_wellness_guidance ENABLE ROW LEVEL SECURITY;
ALTER TABLE numerology_correspondences ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_section_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE planetary_periods ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para as novas tabelas
CREATE POLICY "Authenticated users can view profession guidance" ON profession_guidance FOR SELECT USING (true);
CREATE POLICY "Admins can manage profession guidance" ON profession_guidance FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.auth_user_id = auth.uid() AND p.role = 'admin'::user_role)
);

CREATE POLICY "Authenticated users can view health guidance" ON health_wellness_guidance FOR SELECT USING (true);
CREATE POLICY "Admins can manage health guidance" ON health_wellness_guidance FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.auth_user_id = auth.uid() AND p.role = 'admin'::user_role)
);

CREATE POLICY "Authenticated users can view correspondences" ON numerology_correspondences FOR SELECT USING (true);
CREATE POLICY "Admins can manage correspondences" ON numerology_correspondences FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.auth_user_id = auth.uid() AND p.role = 'admin'::user_role)
);

CREATE POLICY "Authenticated users can view map templates" ON map_section_templates FOR SELECT USING (true);
CREATE POLICY "Admins can manage map templates" ON map_section_templates FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.auth_user_id = auth.uid() AND p.role = 'admin'::user_role)
);

CREATE POLICY "Authenticated users can view planetary periods" ON planetary_periods FOR SELECT USING (true);
CREATE POLICY "Admins can manage planetary periods" ON planetary_periods FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.auth_user_id = auth.uid() AND p.role = 'admin'::user_role)
);

-- Função para atualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar timestamps automaticamente
CREATE TRIGGER update_profession_guidance_updated_at BEFORE UPDATE ON profession_guidance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_wellness_updated_at BEFORE UPDATE ON health_wellness_guidance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_correspondences_updated_at BEFORE UPDATE ON numerology_correspondences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();  
CREATE TRIGGER update_map_templates_updated_at BEFORE UPDATE ON map_section_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_planetary_periods_updated_at BEFORE UPDATE ON planetary_periods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();