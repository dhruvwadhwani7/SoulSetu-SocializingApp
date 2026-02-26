export interface PrivateProfile {
  id: string;
  first_name: string;
  last_name: string;
  dob: string;
  height_cm: number;
  neighborhood: string;
  latitude: number;
  longitude: number;
  max_distance_km: number;
  min_age: number;
  max_age: number;
  phone: string;
  children: Option | null;
  family_plan: Option | null;
  covid_vaccine: Option | null;
  zodiac_sign: Option | null;
  sexuality: Option | null;
  gender: Option | null;
  ethnicities: Option[];
  pets: Option[];
  pronouns: Option[];
  ethnicity_preferences: Option[];
  gender_preferences: Option[];
  answers: Answer[];
  photos: Photo[];
  avatar_url: string;
  spotify_connected?: boolean;
  spotify_show_on_profile?: boolean;
  spotify_user_id?: string;
  spotify_top_artists?: {
    id: string;
    name: string;
    image?: string;
  }[];
  spotify_genres?: string[];
}

export interface Photo {
  id: string;
  photo_url: string;
  photo_order: number;
}

export interface Answer {
  id: string;
  question: string;
  prompt_id: number;
  answer_text: string;
  answer_order: number;
}

export interface Option {
  id: number;
  name: string;
  plural_name?: string;
}