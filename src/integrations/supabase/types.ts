export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]
export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          color: string
          created_at: string
          definition: string | null
          description: string | null
          id: string
          introduction_text: string | null
          likes_count: number | null
          name: string
          personalization_guide: string | null
          updated_at: string
        }
        Insert: {
          color: string
          created_at?: string
          definition?: string | null
          description?: string | null
          id?: string
          introduction_text?: string | null
          likes_count?: number | null
          name: string
          personalization_guide?: string | null
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          definition?: string | null
          description?: string | null
          id?: string
          introduction_text?: string | null
          likes_count?: number | null
          name?: string
          personalization_guide?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      category_likes: {
        Row: {
          category_id: string
          created_at: string | null
          id: string
          user_ip: string
        }
        Insert: {
          category_id: string
          created_at?: string | null
          id?: string
          user_ip: string
        }
        Update: {
          category_id?: string
          created_at?: string | null
          id?: string
          user_ip?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_likes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      category_themes: {
        Row: {
          category_id: string
          created_at: string
          id: string
          theme_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          theme_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          theme_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_themes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_themes_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      content_examples: {
        Row: {
          content_url: string
          created_at: string
          creator_name: string
          description: string | null
          format: string | null
          id: string
          platform: string | null
          subcategory_id: string
          title: string
        }
        Insert: {
          content_url: string
          created_at?: string
          creator_name: string
          description?: string | null
          format?: string | null
          id?: string
          platform?: string | null
          subcategory_id: string
          title: string
        }
        Update: {
          content_url?: string
          created_at?: string
          creator_name?: string
          description?: string | null
          format?: string | null
          id?: string
          platform?: string | null
          subcategory_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_examples_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      content_titles: {
        Row: {
          created_at: string
          format: string | null
          id: string
          platform: string | null
          subcategory_id: string
          title: string
          type: string | null
        }
        Insert: {
          created_at?: string
          format?: string | null
          id?: string
          platform?: string | null
          subcategory_id: string
          title: string
          type?: string | null
        }
        Update: {
          created_at?: string
          format?: string | null
          id?: string
          platform?: string | null
          subcategory_id?: string
          title?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_titles_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      exemplary_accounts: {
        Row: {
          account_name: string
          account_url: string
          created_at: string
          description: string | null
          id: string
          platform: string
          subcategory_id: string
        }
        Insert: {
          account_name: string
          account_url: string
          created_at?: string
          description?: string | null
          id?: string
          platform: string
          subcategory_id: string
        }
        Update: {
          account_name?: string
          account_url?: string
          created_at?: string
          description?: string | null
          id?: string
          platform?: string
          subcategory_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exemplary_accounts_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      inspiring_content: {
        Row: {
          account_example: string | null
          account_url: string | null
          created_at: string
          format: string | null
          hashtags: string[] | null
          hook: string | null
          id: string
          platform: string | null
          popularity_score: number | null
          status: string | null
          subcategory_id: string
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          account_example?: string | null
          account_url?: string | null
          created_at?: string
          format?: string | null
          hashtags?: string[] | null
          hook?: string | null
          id?: string
          platform?: string | null
          popularity_score?: number | null
          status?: string | null
          subcategory_id: string
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          account_example?: string | null
          account_url?: string | null
          created_at?: string
          format?: string | null
          hashtags?: string[] | null
          hook?: string | null
          id?: string
          platform?: string | null
          popularity_score?: number | null
          status?: string | null
          subcategory_id?: string
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspiring_content_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subcategories: {
        Row: {
          auto_generation_completed: boolean | null
          category_id: string
          created_at: string
          definition: string | null
          description: string | null
          id: string
          is_auto_generated: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          auto_generation_completed?: boolean | null
          category_id: string
          created_at?: string
          definition?: string | null
          description?: string | null
          id?: string
          is_auto_generated?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          auto_generation_completed?: boolean | null
          category_id?: string
          created_at?: string
          definition?: string | null
          description?: string | null
          id?: string
          is_auto_generated?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategory_content_templates: {
        Row: {
          created_at: string | null
          id: string
          subcategory_id: string
          template_example: string | null
          template_structure: string
          template_title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          subcategory_id: string
          template_example?: string | null
          template_structure: string
          template_title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          subcategory_id?: string
          template_example?: string | null
          template_structure?: string
          template_title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subcategory_content_templates_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategory_hashtags: {
        Row: {
          created_at: string | null
          hashtag: string
          hashtag_order: number
          id: string
          subcategory_id: string
        }
        Insert: {
          created_at?: string | null
          hashtag: string
          hashtag_order?: number
          id?: string
          subcategory_id: string
        }
        Update: {
          created_at?: string | null
          hashtag?: string
          hashtag_order?: number
          id?: string
          subcategory_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategory_hashtags_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategory_hooks: {
        Row: {
          created_at: string | null
          hook_order: number
          hook_text: string
          id: string
          subcategory_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          hook_order?: number
          hook_text: string
          id?: string
          subcategory_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          hook_order?: number
          hook_text?: string
          id?: string
          subcategory_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subcategory_hooks_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategory_metrics: {
        Row: {
          created_at: string | null
          id: string
          metric_description: string | null
          metric_name: string
          metric_order: number
          subcategory_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          metric_description?: string | null
          metric_name: string
          metric_order?: number
          subcategory_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          metric_description?: string | null
          metric_name?: string
          metric_order?: number
          subcategory_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategory_metrics_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      themes: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          category_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          age: string | null
          content_preferences: string[] | null
          created_at: string
          experience: string | null
          frequency: string | null
          goals: string | null
          id: string
          interests: string[] | null
          platforms: string[] | null
          profession: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: string | null
          content_preferences?: string[] | null
          created_at?: string
          experience?: string | null
          frequency?: string | null
          goals?: string | null
          id?: string
          interests?: string[] | null
          platforms?: string[] | null
          profession?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: string | null
          content_preferences?: string[] | null
          created_at?: string
          experience?: string | null
          frequency?: string | null
          goals?: string | null
          id?: string
          interests?: string[] | null
          platforms?: string[] | null
          profession?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
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
      app_role: ["admin", "user"],
    },
  },
} as const
