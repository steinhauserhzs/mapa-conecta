export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analyses: {
        Row: {
          created_at: string
          id: string
          input: Json
          map_id: string | null
          result: Json
          type: Database["public"]["Enums"]["map_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          input?: Json
          map_id?: string | null
          result?: Json
          type: Database["public"]["Enums"]["map_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          input?: Json
          map_id?: string | null
          result?: Json
          type?: Database["public"]["Enums"]["map_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analyses_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analyses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          created_at: string
          id: string
          metadata: Json
          type: string
          url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json
          type: string
          url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json
          type?: string
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cabalistic_angels: {
        Row: {
          biblical_references: string | null
          category: string
          color_correspondences: string[] | null
          communication_methods: string[] | null
          complete_prayer: string | null
          created_at: string
          crystal_associations: string[] | null
          detailed_invocation: string | null
          domain_description: string
          gratitude_practices: string | null
          healing_specialties: string[] | null
          historical_accounts: string | null
          id: string
          incense_oils: string[] | null
          integration_daily_life: string | null
          invocation_time_1: string | null
          invocation_time_2: string | null
          lunar_timing: string | null
          manifestation_areas: string[] | null
          miracle_stories: string | null
          name: string
          negative_influence: string | null
          offering_suggestions: string[] | null
          planetary_hours: string | null
          protection_methods: string | null
          psalm_reference: string | null
          ritual_instructions: string | null
          sacred_geometry: string | null
          signs_presence: string[] | null
          updated_at: string
        }
        Insert: {
          biblical_references?: string | null
          category: string
          color_correspondences?: string[] | null
          communication_methods?: string[] | null
          complete_prayer?: string | null
          created_at?: string
          crystal_associations?: string[] | null
          detailed_invocation?: string | null
          domain_description: string
          gratitude_practices?: string | null
          healing_specialties?: string[] | null
          historical_accounts?: string | null
          id?: string
          incense_oils?: string[] | null
          integration_daily_life?: string | null
          invocation_time_1?: string | null
          invocation_time_2?: string | null
          lunar_timing?: string | null
          manifestation_areas?: string[] | null
          miracle_stories?: string | null
          name: string
          negative_influence?: string | null
          offering_suggestions?: string[] | null
          planetary_hours?: string | null
          protection_methods?: string | null
          psalm_reference?: string | null
          ritual_instructions?: string | null
          sacred_geometry?: string | null
          signs_presence?: string[] | null
          updated_at?: string
        }
        Update: {
          biblical_references?: string | null
          category?: string
          color_correspondences?: string[] | null
          communication_methods?: string[] | null
          complete_prayer?: string | null
          created_at?: string
          crystal_associations?: string[] | null
          detailed_invocation?: string | null
          domain_description?: string
          gratitude_practices?: string | null
          healing_specialties?: string[] | null
          historical_accounts?: string | null
          id?: string
          incense_oils?: string[] | null
          integration_daily_life?: string | null
          invocation_time_1?: string | null
          invocation_time_2?: string | null
          lunar_timing?: string | null
          manifestation_areas?: string[] | null
          miracle_stories?: string | null
          name?: string
          negative_influence?: string | null
          offering_suggestions?: string[] | null
          planetary_hours?: string | null
          protection_methods?: string | null
          psalm_reference?: string | null
          ritual_instructions?: string | null
          sacred_geometry?: string | null
          signs_presence?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      calculation_rules: {
        Row: {
          config: Json
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_default: boolean
          name: string
          version: number
        }
        Insert: {
          config?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean
          name: string
          version?: number
        }
        Update: {
          config?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean
          name?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "calculation_rules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          birth_date: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversion_tables: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_default: boolean
          locale: string
          mapping: Json
          name: string
          normalization_rules: Json
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_default?: boolean
          locale?: string
          mapping?: Json
          name: string
          normalization_rules?: Json
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_default?: boolean
          locale?: string
          mapping?: Json
          name?: string
          normalization_rules?: Json
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "conversion_tables_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_wellness_guidance: {
        Row: {
          body_system: string
          created_at: string
          dietary_suggestions: string | null
          emotional_health: string | null
          energy_cycles: string | null
          healing_modalities: string[] | null
          health_tendencies: string
          holistic_approaches: string | null
          id: string
          lifestyle_adjustments: string | null
          medical_checkups: string | null
          mental_clarity: string | null
          number: number
          preventive_measures: string | null
          recommended_exercises: string[] | null
          sleep_patterns: string | null
          spiritual_practices: string[] | null
          stress_management: string | null
          supplements_herbs: string[] | null
          updated_at: string
          warning_signs: string[] | null
        }
        Insert: {
          body_system: string
          created_at?: string
          dietary_suggestions?: string | null
          emotional_health?: string | null
          energy_cycles?: string | null
          healing_modalities?: string[] | null
          health_tendencies: string
          holistic_approaches?: string | null
          id?: string
          lifestyle_adjustments?: string | null
          medical_checkups?: string | null
          mental_clarity?: string | null
          number: number
          preventive_measures?: string | null
          recommended_exercises?: string[] | null
          sleep_patterns?: string | null
          spiritual_practices?: string[] | null
          stress_management?: string | null
          supplements_herbs?: string[] | null
          updated_at?: string
          warning_signs?: string[] | null
        }
        Update: {
          body_system?: string
          created_at?: string
          dietary_suggestions?: string | null
          emotional_health?: string | null
          energy_cycles?: string | null
          healing_modalities?: string[] | null
          health_tendencies?: string
          holistic_approaches?: string | null
          id?: string
          lifestyle_adjustments?: string | null
          medical_checkups?: string | null
          mental_clarity?: string | null
          number?: number
          preventive_measures?: string | null
          recommended_exercises?: string[] | null
          sleep_patterns?: string | null
          spiritual_practices?: string[] | null
          stress_management?: string | null
          supplements_herbs?: string[] | null
          updated_at?: string
          warning_signs?: string[] | null
        }
        Relationships: []
      }
      love_compatibility: {
        Row: {
          challenges_solutions: string | null
          communication_style: string | null
          compatibility_score: number | null
          compatibility_text: string
          conflict_resolution: string | null
          created_at: string
          detailed_analysis: string | null
          energy_exchange: string | null
          financial_compatibility: string | null
          gift_suggestions: string[] | null
          growth_potential: string | null
          healing_opportunities: string | null
          id: string
          ideal_date_ideas: string[] | null
          intimacy_patterns: string | null
          karmic_relationship: string | null
          long_term_outlook: string | null
          marriage_potential: string | null
          number_1: number
          number_2: number
          parenting_style: string | null
          past_life_connections: string | null
          red_flags: string[] | null
          relationship_dynamics: string | null
          relationship_milestones: string | null
          social_dynamics: string | null
          soul_lessons: string | null
          spiritual_connection: string | null
          success_strategies: string[] | null
        }
        Insert: {
          challenges_solutions?: string | null
          communication_style?: string | null
          compatibility_score?: number | null
          compatibility_text: string
          conflict_resolution?: string | null
          created_at?: string
          detailed_analysis?: string | null
          energy_exchange?: string | null
          financial_compatibility?: string | null
          gift_suggestions?: string[] | null
          growth_potential?: string | null
          healing_opportunities?: string | null
          id?: string
          ideal_date_ideas?: string[] | null
          intimacy_patterns?: string | null
          karmic_relationship?: string | null
          long_term_outlook?: string | null
          marriage_potential?: string | null
          number_1: number
          number_2: number
          parenting_style?: string | null
          past_life_connections?: string | null
          red_flags?: string[] | null
          relationship_dynamics?: string | null
          relationship_milestones?: string | null
          social_dynamics?: string | null
          soul_lessons?: string | null
          spiritual_connection?: string | null
          success_strategies?: string[] | null
        }
        Update: {
          challenges_solutions?: string | null
          communication_style?: string | null
          compatibility_score?: number | null
          compatibility_text?: string
          conflict_resolution?: string | null
          created_at?: string
          detailed_analysis?: string | null
          energy_exchange?: string | null
          financial_compatibility?: string | null
          gift_suggestions?: string[] | null
          growth_potential?: string | null
          healing_opportunities?: string | null
          id?: string
          ideal_date_ideas?: string[] | null
          intimacy_patterns?: string | null
          karmic_relationship?: string | null
          long_term_outlook?: string | null
          marriage_potential?: string | null
          number_1?: number
          number_2?: number
          parenting_style?: string | null
          past_life_connections?: string | null
          red_flags?: string[] | null
          relationship_dynamics?: string | null
          relationship_milestones?: string | null
          social_dynamics?: string | null
          soul_lessons?: string | null
          spiritual_connection?: string | null
          success_strategies?: string[] | null
        }
        Relationships: []
      }
      map_section_templates: {
        Row: {
          conditional_display: Json | null
          content_structure: Json
          created_at: string
          display_order: number
          formatting_instructions: string | null
          id: string
          page_break_after: boolean | null
          page_break_before: boolean | null
          professional_notes: string | null
          required_data: string[] | null
          section_type: string
          styling_rules: Json
          subtitle: string | null
          template_name: string
          title: string
          updated_at: string
        }
        Insert: {
          conditional_display?: Json | null
          content_structure?: Json
          created_at?: string
          display_order?: number
          formatting_instructions?: string | null
          id?: string
          page_break_after?: boolean | null
          page_break_before?: boolean | null
          professional_notes?: string | null
          required_data?: string[] | null
          section_type: string
          styling_rules?: Json
          subtitle?: string | null
          template_name: string
          title: string
          updated_at?: string
        }
        Update: {
          conditional_display?: Json | null
          content_structure?: Json
          created_at?: string
          display_order?: number
          formatting_instructions?: string | null
          id?: string
          page_break_after?: boolean | null
          page_break_before?: boolean | null
          professional_notes?: string | null
          required_data?: string[] | null
          section_type?: string
          styling_rules?: Json
          subtitle?: string | null
          template_name?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      map_versions: {
        Row: {
          created_at: string
          id: string
          map_id: string
          snapshot_input: Json
          snapshot_result: Json
          version: number
        }
        Insert: {
          created_at?: string
          id?: string
          map_id: string
          snapshot_input?: Json
          snapshot_result?: Json
          version: number
        }
        Update: {
          created_at?: string
          id?: string
          map_id?: string
          snapshot_input?: Json
          snapshot_result?: Json
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "map_versions_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps"
            referencedColumns: ["id"]
          },
        ]
      }
      maps: {
        Row: {
          calculation_rule_id: string | null
          client_id: string | null
          conversion_table_id: string | null
          created_at: string
          id: string
          input: Json
          pdf_url: string | null
          preview_html: string | null
          report_template_id: string | null
          result: Json
          status: Database["public"]["Enums"]["map_status"]
          title: string
          type: Database["public"]["Enums"]["map_type"]
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          calculation_rule_id?: string | null
          client_id?: string | null
          conversion_table_id?: string | null
          created_at?: string
          id?: string
          input?: Json
          pdf_url?: string | null
          preview_html?: string | null
          report_template_id?: string | null
          result?: Json
          status?: Database["public"]["Enums"]["map_status"]
          title: string
          type: Database["public"]["Enums"]["map_type"]
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          calculation_rule_id?: string | null
          client_id?: string | null
          conversion_table_id?: string | null
          created_at?: string
          id?: string
          input?: Json
          pdf_url?: string | null
          preview_html?: string | null
          report_template_id?: string | null
          result?: Json
          status?: Database["public"]["Enums"]["map_status"]
          title?: string
          type?: Database["public"]["Enums"]["map_type"]
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "maps_calculation_rule_id_fkey"
            columns: ["calculation_rule_id"]
            isOneToOne: false
            referencedRelation: "calculation_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maps_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maps_conversion_table_id_fkey"
            columns: ["conversion_table_id"]
            isOneToOne: false
            referencedRelation: "conversion_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maps_report_template_id_fkey"
            columns: ["report_template_id"]
            isOneToOne: false
            referencedRelation: "report_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      numerology_correspondences: {
        Row: {
          acquisition_tips: string | null
          astrological_connection: string | null
          care_instructions: string | null
          chakra_alignment: string | null
          combination_suggestions: string[] | null
          correspondence_type: string
          created_at: string
          cultural_associations: string | null
          hex_color: string | null
          historical_significance: string | null
          id: string
          name: string
          number: number
          properties: string
          ritual_applications: string | null
          scientific_properties: string | null
          seasonal_timing: string | null
          spiritual_meaning: string | null
          therapeutic_benefits: string | null
          updated_at: string
          usage_instructions: string | null
        }
        Insert: {
          acquisition_tips?: string | null
          astrological_connection?: string | null
          care_instructions?: string | null
          chakra_alignment?: string | null
          combination_suggestions?: string[] | null
          correspondence_type: string
          created_at?: string
          cultural_associations?: string | null
          hex_color?: string | null
          historical_significance?: string | null
          id?: string
          name: string
          number: number
          properties: string
          ritual_applications?: string | null
          scientific_properties?: string | null
          seasonal_timing?: string | null
          spiritual_meaning?: string | null
          therapeutic_benefits?: string | null
          updated_at?: string
          usage_instructions?: string | null
        }
        Update: {
          acquisition_tips?: string | null
          astrological_connection?: string | null
          care_instructions?: string | null
          chakra_alignment?: string | null
          combination_suggestions?: string[] | null
          correspondence_type?: string
          created_at?: string
          cultural_associations?: string | null
          hex_color?: string | null
          historical_significance?: string | null
          id?: string
          name?: string
          number?: number
          properties?: string
          ritual_applications?: string | null
          scientific_properties?: string | null
          seasonal_timing?: string | null
          spiritual_meaning?: string | null
          therapeutic_benefits?: string | null
          updated_at?: string
          usage_instructions?: string | null
        }
        Relationships: []
      }
      numerology_texts: {
        Row: {
          affirmations: string | null
          angel_category: string | null
          angel_invocation_time: string | null
          angel_name: string | null
          angel_psalm: string | null
          author_notes: string | null
          bibliography: string | null
          body: string
          calculation_details: string | null
          career_guidance: string | null
          category: string | null
          celebrity_examples: string | null
          chakra_associations: string | null
          color_associations: string[] | null
          compatibility_notes: string | null
          content_length: number | null
          created_at: string
          cross_references: string[] | null
          display_order: number | null
          energy_description: string | null
          examples: string | null
          financial_tendencies: string | null
          formatting_rules: Json | null
          growth_opportunities: string | null
          health_associations: string[] | null
          health_recommendations: string | null
          historical_context: string | null
          id: string
          integration_practices: string | null
          is_master_number: boolean | null
          karmic_lessons_detail: string | null
          key_number: number
          keywords: string[] | null
          lang: string
          life_periods: string | null
          meditation_guide: string | null
          numerological_formula: string | null
          page_section: string | null
          practical_guidance: string | null
          priority: number | null
          profession_associations: string[] | null
          professional_applications: string | null
          psychological_analysis: string | null
          recommendations: string | null
          relationship_advice: string | null
          seasonal_influences: string | null
          section: string
          shadow_aspects: string | null
          spiritual_aspects: string | null
          spiritual_mission: string | null
          stone_associations: string[] | null
          subcategory: string | null
          tarot_connections: string | null
          template_type: string | null
          therapeutic_approach: string | null
          title: string
          updated_at: string
          version: string
          warnings: string | null
        }
        Insert: {
          affirmations?: string | null
          angel_category?: string | null
          angel_invocation_time?: string | null
          angel_name?: string | null
          angel_psalm?: string | null
          author_notes?: string | null
          bibliography?: string | null
          body: string
          calculation_details?: string | null
          career_guidance?: string | null
          category?: string | null
          celebrity_examples?: string | null
          chakra_associations?: string | null
          color_associations?: string[] | null
          compatibility_notes?: string | null
          content_length?: number | null
          created_at?: string
          cross_references?: string[] | null
          display_order?: number | null
          energy_description?: string | null
          examples?: string | null
          financial_tendencies?: string | null
          formatting_rules?: Json | null
          growth_opportunities?: string | null
          health_associations?: string[] | null
          health_recommendations?: string | null
          historical_context?: string | null
          id?: string
          integration_practices?: string | null
          is_master_number?: boolean | null
          karmic_lessons_detail?: string | null
          key_number: number
          keywords?: string[] | null
          lang?: string
          life_periods?: string | null
          meditation_guide?: string | null
          numerological_formula?: string | null
          page_section?: string | null
          practical_guidance?: string | null
          priority?: number | null
          profession_associations?: string[] | null
          professional_applications?: string | null
          psychological_analysis?: string | null
          recommendations?: string | null
          relationship_advice?: string | null
          seasonal_influences?: string | null
          section: string
          shadow_aspects?: string | null
          spiritual_aspects?: string | null
          spiritual_mission?: string | null
          stone_associations?: string[] | null
          subcategory?: string | null
          tarot_connections?: string | null
          template_type?: string | null
          therapeutic_approach?: string | null
          title: string
          updated_at?: string
          version?: string
          warnings?: string | null
        }
        Update: {
          affirmations?: string | null
          angel_category?: string | null
          angel_invocation_time?: string | null
          angel_name?: string | null
          angel_psalm?: string | null
          author_notes?: string | null
          bibliography?: string | null
          body?: string
          calculation_details?: string | null
          career_guidance?: string | null
          category?: string | null
          celebrity_examples?: string | null
          chakra_associations?: string | null
          color_associations?: string[] | null
          compatibility_notes?: string | null
          content_length?: number | null
          created_at?: string
          cross_references?: string[] | null
          display_order?: number | null
          energy_description?: string | null
          examples?: string | null
          financial_tendencies?: string | null
          formatting_rules?: Json | null
          growth_opportunities?: string | null
          health_associations?: string[] | null
          health_recommendations?: string | null
          historical_context?: string | null
          id?: string
          integration_practices?: string | null
          is_master_number?: boolean | null
          karmic_lessons_detail?: string | null
          key_number?: number
          keywords?: string[] | null
          lang?: string
          life_periods?: string | null
          meditation_guide?: string | null
          numerological_formula?: string | null
          page_section?: string | null
          practical_guidance?: string | null
          priority?: number | null
          profession_associations?: string[] | null
          professional_applications?: string | null
          psychological_analysis?: string | null
          recommendations?: string | null
          relationship_advice?: string | null
          seasonal_influences?: string | null
          section?: string
          shadow_aspects?: string | null
          spiritual_aspects?: string | null
          spiritual_mission?: string | null
          stone_associations?: string[] | null
          subcategory?: string | null
          tarot_connections?: string | null
          template_type?: string | null
          therapeutic_approach?: string | null
          title?: string
          updated_at?: string
          version?: string
          warnings?: string | null
        }
        Relationships: []
      }
      planetary_periods: {
        Row: {
          age_range_end: number
          age_range_start: number
          astrological_connections: string | null
          career_focus: string | null
          challenges: string[] | null
          created_at: string
          famous_examples: string[] | null
          financial_tendencies: string | null
          general_influence: string
          health_considerations: string | null
          historical_context: string | null
          id: string
          integration_practices: string[] | null
          life_themes: string[] | null
          number_association: number
          opportunities: string[] | null
          period_name: string
          personal_development: string | null
          planet: string
          recommended_actions: string[] | null
          relationship_patterns: string | null
          shadow_work: string | null
          spiritual_lessons: string[] | null
          updated_at: string
        }
        Insert: {
          age_range_end: number
          age_range_start: number
          astrological_connections?: string | null
          career_focus?: string | null
          challenges?: string[] | null
          created_at?: string
          famous_examples?: string[] | null
          financial_tendencies?: string | null
          general_influence: string
          health_considerations?: string | null
          historical_context?: string | null
          id?: string
          integration_practices?: string[] | null
          life_themes?: string[] | null
          number_association: number
          opportunities?: string[] | null
          period_name: string
          personal_development?: string | null
          planet: string
          recommended_actions?: string[] | null
          relationship_patterns?: string | null
          shadow_work?: string | null
          spiritual_lessons?: string[] | null
          updated_at?: string
        }
        Update: {
          age_range_end?: number
          age_range_start?: number
          astrological_connections?: string | null
          career_focus?: string | null
          challenges?: string[] | null
          created_at?: string
          famous_examples?: string[] | null
          financial_tendencies?: string | null
          general_influence?: string
          health_considerations?: string | null
          historical_context?: string | null
          id?: string
          integration_practices?: string[] | null
          life_themes?: string[] | null
          number_association?: number
          opportunities?: string[] | null
          period_name?: string
          personal_development?: string | null
          planet?: string
          recommended_actions?: string[] | null
          relationship_patterns?: string | null
          shadow_work?: string | null
          spiritual_lessons?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          active: boolean
          created_at: string
          features: Json
          id: string
          maps_limit: number | null
          name: string
          price_cents: number
          stripe_price_id: string | null
          type: Database["public"]["Enums"]["plan_type"]
        }
        Insert: {
          active?: boolean
          created_at?: string
          features?: Json
          id?: string
          maps_limit?: number | null
          name: string
          price_cents: number
          stripe_price_id?: string | null
          type: Database["public"]["Enums"]["plan_type"]
        }
        Update: {
          active?: boolean
          created_at?: string
          features?: Json
          id?: string
          maps_limit?: number | null
          name?: string
          price_cents?: number
          stripe_price_id?: string | null
          type?: Database["public"]["Enums"]["plan_type"]
        }
        Relationships: []
      }
      profession_guidance: {
        Row: {
          avoid_roles: string[] | null
          challenges: string | null
          collaboration_approach: string | null
          created_at: string
          detailed_description: string
          entrepreneurial_potential: string | null
          famous_professionals: string[] | null
          freelance_potential: string | null
          growth_trajectory: string | null
          id: string
          ideal_companies: string[] | null
          industry_examples: string[] | null
          leadership_style: string | null
          number: number
          profession_category: string
          profession_name: string
          recommended_skills: string[] | null
          salary_expectations: string | null
          success_factors: string | null
          updated_at: string
          work_environment: string | null
        }
        Insert: {
          avoid_roles?: string[] | null
          challenges?: string | null
          collaboration_approach?: string | null
          created_at?: string
          detailed_description: string
          entrepreneurial_potential?: string | null
          famous_professionals?: string[] | null
          freelance_potential?: string | null
          growth_trajectory?: string | null
          id?: string
          ideal_companies?: string[] | null
          industry_examples?: string[] | null
          leadership_style?: string | null
          number: number
          profession_category: string
          profession_name: string
          recommended_skills?: string[] | null
          salary_expectations?: string | null
          success_factors?: string | null
          updated_at?: string
          work_environment?: string | null
        }
        Update: {
          avoid_roles?: string[] | null
          challenges?: string | null
          collaboration_approach?: string | null
          created_at?: string
          detailed_description?: string
          entrepreneurial_potential?: string | null
          famous_professionals?: string[] | null
          freelance_potential?: string | null
          growth_trajectory?: string | null
          id?: string
          ideal_companies?: string[] | null
          industry_examples?: string[] | null
          leadership_style?: string | null
          number?: number
          profession_category?: string
          profession_name?: string
          recommended_skills?: string[] | null
          salary_expectations?: string | null
          success_factors?: string | null
          updated_at?: string
          work_environment?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          auth_user_id: string
          created_at: string
          email: string
          id: string
          name: string | null
          role: Database["public"]["Enums"]["user_role"]
          stripe_customer_id: string | null
          updated_at: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          email: string
          id?: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      report_templates: {
        Row: {
          active: boolean
          cover_asset_url: string | null
          created_at: string
          created_by: string | null
          id: string
          locale: string
          name: string
          sections: Json
          style: Json
          type: Database["public"]["Enums"]["map_type"]
          version: number
        }
        Insert: {
          active?: boolean
          cover_asset_url?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          locale?: string
          name: string
          sections?: Json
          style?: Json
          type: Database["public"]["Enums"]["map_type"]
          version?: number
        }
        Update: {
          active?: boolean
          cover_asset_url?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          locale?: string
          name?: string
          sections?: Json
          style?: Json
          type?: Database["public"]["Enums"]["map_type"]
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "report_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          client_id: string
          created_at: string
          id: string
          map_id: string | null
          service_data: Json
          service_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          map_id?: string | null
          service_data?: Json
          service_type: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          map_id?: string | null
          service_data?: Json
          service_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount_cents: number
          created_at: string
          id: string
          metadata: Json
          status: string
          stripe_payment_intent: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          id?: string
          metadata?: Json
          status: string
          stripe_payment_intent?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          id?: string
          metadata?: Json
          status?: string
          stripe_payment_intent?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      map_status: "draft" | "ready" | "archived"
      map_type:
        | "personal"
        | "business"
        | "baby"
        | "marriage"
        | "phone"
        | "address"
        | "license_plate"
      plan_type: "monthly" | "quarterly" | "yearly" | "credits"
      subscription_status: "active" | "canceled" | "past_due" | "trialing"
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      map_status: ["draft", "ready", "archived"],
      map_type: [
        "personal",
        "business",
        "baby",
        "marriage",
        "phone",
        "address",
        "license_plate",
      ],
      plan_type: ["monthly", "quarterly", "yearly", "credits"],
      subscription_status: ["active", "canceled", "past_due", "trialing"],
      user_role: ["admin", "user"],
    },
  },
} as const
