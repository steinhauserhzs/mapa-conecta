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
          category: string
          created_at: string
          domain_description: string
          id: string
          invocation_time_1: string | null
          invocation_time_2: string | null
          name: string
          negative_influence: string | null
          psalm_reference: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          domain_description: string
          id?: string
          invocation_time_1?: string | null
          invocation_time_2?: string | null
          name: string
          negative_influence?: string | null
          psalm_reference?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          domain_description?: string
          id?: string
          invocation_time_1?: string | null
          invocation_time_2?: string | null
          name?: string
          negative_influence?: string | null
          psalm_reference?: string | null
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
      love_compatibility: {
        Row: {
          compatibility_score: number | null
          compatibility_text: string
          created_at: string
          id: string
          number_1: number
          number_2: number
        }
        Insert: {
          compatibility_score?: number | null
          compatibility_text: string
          created_at?: string
          id?: string
          number_1: number
          number_2: number
        }
        Update: {
          compatibility_score?: number | null
          compatibility_text?: string
          created_at?: string
          id?: string
          number_1?: number
          number_2?: number
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
      numerology_texts: {
        Row: {
          angel_category: string | null
          angel_invocation_time: string | null
          angel_name: string | null
          angel_psalm: string | null
          body: string
          category: string | null
          color_associations: string[] | null
          created_at: string
          health_associations: string[] | null
          id: string
          is_master_number: boolean | null
          key_number: number
          keywords: string[] | null
          lang: string
          priority: number | null
          profession_associations: string[] | null
          section: string
          stone_associations: string[] | null
          subcategory: string | null
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          angel_category?: string | null
          angel_invocation_time?: string | null
          angel_name?: string | null
          angel_psalm?: string | null
          body: string
          category?: string | null
          color_associations?: string[] | null
          created_at?: string
          health_associations?: string[] | null
          id?: string
          is_master_number?: boolean | null
          key_number: number
          keywords?: string[] | null
          lang?: string
          priority?: number | null
          profession_associations?: string[] | null
          section: string
          stone_associations?: string[] | null
          subcategory?: string | null
          title: string
          updated_at?: string
          version?: string
        }
        Update: {
          angel_category?: string | null
          angel_invocation_time?: string | null
          angel_name?: string | null
          angel_psalm?: string | null
          body?: string
          category?: string | null
          color_associations?: string[] | null
          created_at?: string
          health_associations?: string[] | null
          id?: string
          is_master_number?: boolean | null
          key_number?: number
          keywords?: string[] | null
          lang?: string
          priority?: number | null
          profession_associations?: string[] | null
          section?: string
          stone_associations?: string[] | null
          subcategory?: string | null
          title?: string
          updated_at?: string
          version?: string
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
