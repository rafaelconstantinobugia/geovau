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
      hits: {
        Row: {
          created_at: string
          dist_m: number | null
          id: number
          ip: unknown | null
          kind: string
          lat: number | null
          lng: number | null
          poi_id: string | null
          tz: string | null
          ua: string | null
        }
        Insert: {
          created_at?: string
          dist_m?: number | null
          id?: never
          ip?: unknown | null
          kind: string
          lat?: number | null
          lng?: number | null
          poi_id?: string | null
          tz?: string | null
          ua?: string | null
        }
        Update: {
          created_at?: string
          dist_m?: number | null
          id?: never
          ip?: unknown | null
          kind?: string
          lat?: number | null
          lng?: number | null
          poi_id?: string | null
          tz?: string | null
          ua?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hits_poi_id_fkey"
            columns: ["poi_id"]
            isOneToOne: false
            referencedRelation: "pois"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hits_poi_id_fkey"
            columns: ["poi_id"]
            isOneToOne: false
            referencedRelation: "pois_public"
            referencedColumns: ["id"]
          },
        ]
      }
      pois: {
        Row: {
          audio_url: string | null
          id: string
          image_url: string | null
          lat: number
          lng: number
          owner: string | null
          published: boolean
          radius_m: number
          slug: string | null
          tags: string[] | null
          tags_en: string[] | null
          tags_es: string[] | null
          tags_fr: string[] | null
          text: string | null
          text_en: string | null
          text_es: string | null
          text_fr: string | null
          title: string
          title_en: string | null
          title_es: string | null
          title_fr: string | null
          updated_at: string
        }
        Insert: {
          audio_url?: string | null
          id: string
          image_url?: string | null
          lat: number
          lng: number
          owner?: string | null
          published?: boolean
          radius_m?: number
          slug?: string | null
          tags?: string[] | null
          tags_en?: string[] | null
          tags_es?: string[] | null
          tags_fr?: string[] | null
          text?: string | null
          text_en?: string | null
          text_es?: string | null
          text_fr?: string | null
          title: string
          title_en?: string | null
          title_es?: string | null
          title_fr?: string | null
          updated_at?: string
        }
        Update: {
          audio_url?: string | null
          id?: string
          image_url?: string | null
          lat?: number
          lng?: number
          owner?: string | null
          published?: boolean
          radius_m?: number
          slug?: string | null
          tags?: string[] | null
          tags_en?: string[] | null
          tags_es?: string[] | null
          tags_fr?: string[] | null
          text?: string | null
          text_en?: string | null
          text_es?: string | null
          text_fr?: string | null
          title?: string
          title_en?: string | null
          title_es?: string | null
          title_fr?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      pois_public: {
        Row: {
          audio_url: string | null
          id: string | null
          image_url: string | null
          lat: number | null
          lng: number | null
          radius_m: number | null
          slug: string | null
          tags: string[] | null
          tags_en: string[] | null
          tags_es: string[] | null
          tags_fr: string[] | null
          text: string | null
          text_en: string | null
          text_es: string | null
          text_fr: string | null
          title: string | null
          title_en: string | null
          title_es: string | null
          title_fr: string | null
        }
        Insert: {
          audio_url?: string | null
          id?: string | null
          image_url?: string | null
          lat?: number | null
          lng?: number | null
          radius_m?: number | null
          slug?: string | null
          tags?: string[] | null
          tags_en?: string[] | null
          tags_es?: string[] | null
          tags_fr?: string[] | null
          text?: string | null
          text_en?: string | null
          text_es?: string | null
          text_fr?: string | null
          title?: string | null
          title_en?: string | null
          title_es?: string | null
          title_fr?: string | null
        }
        Update: {
          audio_url?: string | null
          id?: string | null
          image_url?: string | null
          lat?: number | null
          lng?: number | null
          radius_m?: number | null
          slug?: string | null
          tags?: string[] | null
          tags_en?: string[] | null
          tags_es?: string[] | null
          tags_fr?: string[] | null
          text?: string | null
          text_en?: string | null
          text_es?: string | null
          text_fr?: string | null
          title?: string | null
          title_en?: string | null
          title_es?: string | null
          title_fr?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      count_hits_ip_minute: {
        Args: { ip_in: unknown }
        Returns: {
          count: number
        }[]
      }
      get_pois_localized: {
        Args: { lang?: string }
        Returns: {
          audio_url: string
          id: string
          image_url: string
          lat: number
          lng: number
          radius_m: number
          slug: string
          tags: string[]
          text: string
          title: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
