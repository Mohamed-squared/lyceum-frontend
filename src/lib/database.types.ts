export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          ai_teacher_personality: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          facebook_url: string | null
          github_url: string | null
          has_completed_onboarding: boolean | null
          hobbies: string[] | null
          id: string
          instagram_url: string | null
          interested_article_topics: string[] | null
          interested_majors: string[] | null
          interested_news_topics: string[] | null
          major: string | null
          major_level: string | null
          notion_url: string | null
          preferred_course_explanation_language: string | null
          preferred_course_material_language: string | null
          preferred_website_language: string | null
          profile_banner_url: string | null
          receive_quotes: boolean | null
          studied_subjects: string[] | null
          subscribed_to_newsletter: boolean | null
          tiktok_url: string | null
          updated_at: string | null
          user_role: string | null
          x_url: string | null
        }
        Insert: {
          ai_teacher_personality?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          facebook_url?: string | null
          github_url?: string | null
          has_completed_onboarding?: boolean | null
          hobbies?: string[] | null
          id: string
          instagram_url?: string | null
          interested_article_topics?: string[] | null
          interested_majors?: string[] | null
          interested_news_topics?: string[] | null
          major?: string | null
          major_level?: string | null
          notion_url?: string | null
          preferred_course_explanation_language?: string | null
          preferred_course_material_language?: string | null
          preferred_website_language?: string | null
          profile_banner_url?: string | null
          receive_quotes?: boolean | null
          studied_subjects?: string[] | null
          subscribed_to_newsletter?: boolean | null
          tiktok_url?: string | null
          updated_at?: string | null
          user_role?: string | null
          x_url?: string | null
        }
        Update: {
          ai_teacher_personality?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          facebook_url?: string | null
          github_url?: string | null
          has_completed_onboarding?: boolean | null
          hobbies?: string[] | null
          id?: string
          instagram_url?: string | null
          interested_article_topics?: string[] | null
          interested_majors?: string[] | null
          interested_news_topics?: string[] | null
          major?: string | null
          major_level?: string | null
          notion_url?: string | null
          preferred_course_explanation_language?: string | null
          preferred_course_material_language?: string | null
          preferred_website_language?: string | null
          profile_banner_url?: string | null
          receive_quotes?: boolean | null
          studied_subjects?: string[] | null
          subscribed_to_newsletter?: boolean | null
          tiktok_url?: string | null
          updated_at?: string | null
          user_role?: string | null
          x_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
