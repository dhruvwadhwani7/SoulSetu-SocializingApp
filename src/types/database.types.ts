export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      children: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      covid_vaccine: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      ethnicities: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      family_plans: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      genders: {
        Row: {
          id: number
          name: string
          plural_name: string | null
        }
        Insert: {
          id?: number
          name: string
          plural_name?: string | null
        }
        Update: {
          id?: number
          name?: string
          plural_name?: string | null
        }
        Relationships: []
      }
      interaction_status: {
        Row: {
          id: number
          status: string
        }
        Insert: {
          id?: number
          status: string
        }
        Update: {
          id?: number
          status?: string
        }
        Relationships: []
      }
      interactions: {
        Row: {
          actor_id: string
          answer_id: string | null
          created_at: string
          id: string
          photo_id: string | null
          status_id: number
          target_id: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          actor_id: string
          answer_id?: string | null
          created_at?: string
          id?: string
          photo_id?: string | null
          status_id: number
          target_id: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          actor_id?: string
          answer_id?: string | null
          created_at?: string
          id?: string
          photo_id?: string | null
          status_id?: number
          target_id?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "interactions_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_answer_id_fkey"
            columns: ["answer_id"]
            isOneToOne: false
            referencedRelation: "profile_answers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "profile_photos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "interaction_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      profile_answers: {
        Row: {
          answer_order: number
          answer_text: string
          created_at: string
          id: string
          is_active: boolean
          profile_id: string
          prompt_id: number
        }
        Insert: {
          answer_order: number
          answer_text: string
          created_at?: string
          id?: string
          is_active: boolean
          profile_id: string
          prompt_id: number
        }
        Update: {
          answer_order?: number
          answer_text?: string
          created_at?: string
          id?: string
          is_active?: boolean
          profile_id?: string
          prompt_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "profile_answers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_answers_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_ethnicities: {
        Row: {
          ethnicity_id: number
          profile_id: string
        }
        Insert: {
          ethnicity_id: number
          profile_id: string
        }
        Update: {
          ethnicity_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_ethnicities_ethnicity_id_fkey"
            columns: ["ethnicity_id"]
            isOneToOne: false
            referencedRelation: "ethnicities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_ethnicities_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_ethnicity_preferences: {
        Row: {
          ethnicity_id: number
          profile_id: string
        }
        Insert: {
          ethnicity_id: number
          profile_id: string
        }
        Update: {
          ethnicity_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_ethnicity_preferences_ethnicity_id_fkey"
            columns: ["ethnicity_id"]
            isOneToOne: false
            referencedRelation: "ethnicities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_ethnicity_preferences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_gender_preferences: {
        Row: {
          gender_id: number
          profile_id: string
        }
        Insert: {
          gender_id: number
          profile_id: string
        }
        Update: {
          gender_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_gender_preferences_gender_id_fkey"
            columns: ["gender_id"]
            isOneToOne: false
            referencedRelation: "genders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_gender_preferences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_pets: {
        Row: {
          pet_id: number
          profile_id: string
        }
        Insert: {
          pet_id: number
          profile_id: string
        }
        Update: {
          pet_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_pets_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_pets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_photos: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          photo_order: number
          photo_url: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active: boolean
          photo_order: number
          photo_url: string
          profile_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          photo_order?: number
          photo_url?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_photos_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_pronouns: {
        Row: {
          profile_id: string
          pronoun_id: number
        }
        Insert: {
          profile_id: string
          pronoun_id: number
        }
        Update: {
          profile_id?: string
          pronoun_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "profile_pronouns_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_pronouns_pronoun_id_fkey"
            columns: ["pronoun_id"]
            isOneToOne: false
            referencedRelation: "pronouns"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          children_id: number | null
          covid_vaccine_id: number | null
          created_at: string
          dob: string | null
          email_id: string | null
          family_plan_id: number | null
          first_name: string | null
          gender_id: number | null
          height_cm: number | null
          id: string
          last_name: string | null
          latitude: number | null
          location: unknown
          longitude: number | null
          max_age: number | null
          max_distance_km: number | null
          min_age: number | null
          neighborhood: string | null
          phone: string | null
          sexuality_id: number | null
          updated_at: string
          user_id: string | null
          zodiac_sign_id: number | null
        }
        Insert: {
          children_id?: number | null
          covid_vaccine_id?: number | null
          created_at?: string
          dob?: string | null
          email_id?: string | null
          family_plan_id?: number | null
          first_name?: string | null
          gender_id?: number | null
          height_cm?: number | null
          id?: string
          last_name?: string | null
          latitude?: number | null
          location?: unknown
          longitude?: number | null
          max_age?: number | null
          max_distance_km?: number | null
          min_age?: number | null
          neighborhood?: string | null
          phone?: string | null
          sexuality_id?: number | null
          updated_at?: string
          user_id?: string | null
          zodiac_sign_id?: number | null
        }
        Update: {
          children_id?: number | null
          covid_vaccine_id?: number | null
          created_at?: string
          dob?: string | null
          email_id?: string | null
          family_plan_id?: number | null
          first_name?: string | null
          gender_id?: number | null
          height_cm?: number | null
          id?: string
          last_name?: string | null
          latitude?: number | null
          location?: unknown
          longitude?: number | null
          max_age?: number | null
          max_distance_km?: number | null
          min_age?: number | null
          neighborhood?: string | null
          phone?: string | null
          sexuality_id?: number | null
          updated_at?: string
          user_id?: string | null
          zodiac_sign_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_children_id_fkey"
            columns: ["children_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_covid_vaccine_id_fkey"
            columns: ["covid_vaccine_id"]
            isOneToOne: false
            referencedRelation: "covid_vaccine"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_family_plan_id_fkey"
            columns: ["family_plan_id"]
            isOneToOne: false
            referencedRelation: "family_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_gender_id_fkey"
            columns: ["gender_id"]
            isOneToOne: false
            referencedRelation: "genders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_sexuality_id_fkey"
            columns: ["sexuality_id"]
            isOneToOne: false
            referencedRelation: "sexualities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_zodiac_sign_id_fkey"
            columns: ["zodiac_sign_id"]
            isOneToOne: false
            referencedRelation: "zodiac_signs"
            referencedColumns: ["id"]
          },
        ]
      }
      prompts: {
        Row: {
          id: number
          question: string
        }
        Insert: {
          id?: number
          question: string
        }
        Update: {
          id?: number
          question?: string
        }
        Relationships: []
      }
      pronouns: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      sexualities: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      zodiac_signs: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_likes: {
        Args: never
        Returns: {
          answer_text: string
          id: string
          photo_url: string
          profile: Json
          question: string
        }[]
      }
      get_profile: {
        Args: never
        Returns: {
          answers: Json
          avatar_url: string
          children: Json
          covid_vaccine: Json
          dob: string
          ethnicities: Json
          ethnicity_preferences: Json
          family_plan: Json
          first_name: string
          gender: Json
          gender_preferences: Json
          height_cm: number
          id: string
          last_name: string
          latitude: number
          longitude: number
          max_age: number
          max_distance_km: number
          min_age: number
          neighborhood: string
          pets: Json
          phone: string
          photos: Json
          pronouns: Json
          sexuality: Json
          zodiac_sign: Json
        }[]
      }
      get_profiles: {
        Args: { page_size: number }
        Returns: {
          age: number
          answers: Json
          children: string
          covid_vaccine: string
          ethnicities: string[]
          family_plan: string
          first_name: string
          gender: string
          height_cm: number
          id: string
          neighborhood: string
          pets: string[]
          photos: Json
          pronouns: string[]
          sexuality: string
          zodiac_sign: string
        }[]
      }
      like_profile: {
        Args: { answer?: string; photo?: string; profile: string }
        Returns: string
      }
      match: { Args: { interaction: string }; Returns: undefined }
      remove_like: { Args: { interaction: string }; Returns: undefined }
      skip_profile: { Args: { profile: string }; Returns: string }
      unmatch: { Args: { interaction: string }; Returns: undefined }
      update_age_range: {
        Args: { max_age: number; min_age: number }
        Returns: undefined
      }
      update_distance: { Args: { distance: number }; Returns: undefined }
      update_ethnicity_preferences: {
        Args: { ethnicity_preferences: number[] }
        Returns: undefined
      }
      update_gender_preferences: {
        Args: { gender_preferences: number[] }
        Returns: undefined
      }
      update_location: {
        Args: { latitude: number; longitude: number; neighborhood: string }
        Returns: undefined
      }
      update_profile: {
        Args: {
          answers?: Json
          children?: number
          covid_vaccine?: number
          dob?: string
          ethnicities?: number[]
          family_plan?: number
          first_name?: string
          gender?: number
          gender_preferences?: number[]
          height_cm?: number
          last_name?: string
          latitude?: number
          longitude?: number
          neighborhood?: string
          pets?: number[]
          photos?: Json
          pronouns?: number[]
          sexuality?: number
          zodiac_sign?: number
        }
        Returns: undefined
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

