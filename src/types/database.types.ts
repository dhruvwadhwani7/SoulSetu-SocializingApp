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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
          family_plan_id: number | null
          first_name: string | null
          gender_id: number | null
          height_cm: number | null
          id: string
          last_name: string | null
          latitude: number | null
          location: unknown | null
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
          family_plan_id?: number | null
          first_name?: string | null
          gender_id?: number | null
          height_cm?: number | null
          id?: string
          last_name?: string | null
          latitude?: number | null
          location?: unknown | null
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
          family_plan_id?: number | null
          first_name?: string | null
          gender_id?: number | null
          height_cm?: number | null
          id?: string
          last_name?: string | null
          latitude?: number | null
          location?: unknown | null
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
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          photo_url: string
          answer_text: string
          question: string
          profile: Json
        }[]
      }
      get_profile: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          first_name: string
          last_name: string
          dob: string
          height_cm: number
          neighborhood: string
          latitude: number
          longitude: number
          max_distance_km: number
          min_age: number
          max_age: number
          phone: string
          children: Json
          family_plan: Json
          covid_vaccine: Json
          zodiac_sign: Json
          sexuality: Json
          gender: Json
          ethnicities: Json
          pets: Json
          pronouns: Json
          ethnicity_preferences: Json
          gender_preferences: Json
          answers: Json
          photos: Json
          avatar_url: string
        }[]
      }
      get_profiles: {
        Args: {
          page_size: number
        }
        Returns: {
          id: string
          first_name: string
          age: number
          height_cm: number
          neighborhood: string
          children: string
          family_plan: string
          covid_vaccine: string
          zodiac_sign: string
          gender: string
          sexuality: string
          ethnicities: string[]
          pets: string[]
          pronouns: string[]
          photos: Json
          answers: Json
        }[]
      }
      like_profile: {
        Args: {
          profile: string
          photo?: string
          answer?: string
        }
        Returns: string
      }
      match: {
        Args: {
          interaction: string
        }
        Returns: undefined
      }
      remove_like: {
        Args: {
          interaction: string
        }
        Returns: undefined
      }
      review_profiles: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      skip_profile: {
        Args: {
          profile: string
        }
        Returns: string
      }
      unmatch: {
        Args: {
          interaction: string
        }
        Returns: undefined
      }
      update_age_range: {
        Args: {
          min_age: number
          max_age: number
        }
        Returns: undefined
      }
      update_distance: {
        Args: {
          distance: number
        }
        Returns: undefined
      }
      update_ethnicity_preferences: {
        Args: {
          ethnicity_preferences: number[]
        }
        Returns: undefined
      }
      update_gender_preferences: {
        Args: {
          gender_preferences: number[]
        }
        Returns: undefined
      }
      update_location: {
        Args: {
          latitude: number
          longitude: number
          neighborhood: string
        }
        Returns: undefined
      }
      update_profile: {
        Args: {
          first_name?: string
          last_name?: string
          dob?: string
          height_cm?: number
          neighborhood?: string
          latitude?: number
          longitude?: number
          children?: number
          family_plan?: number
          covid_vaccine?: number
          zodiac_sign?: number
          sexuality?: number
          gender?: number
          ethnicities?: number[]
          pets?: number[]
          pronouns?: number[]
          gender_preferences?: number[]
          answers?: Json
          photos?: Json
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
