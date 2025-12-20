export interface Like {
  id: string;
  photo_url: string | null;
  answer_text: string | null;
  question: string | null;
  profile: PublicProfile;
}

export interface PublicProfile {
  id: string;
  age: number;
  pets: string[];
  gender: string;
  photos: Photo[];
  answers: Answer[];
  children: string;
  pronouns: string[];
  height_cm: number;
  sexuality: string;
  first_name: string;
  ethnicities: string[];
  family_plan: string;
  zodiac_sign: string;
  neighborhood: string;
  covid_vaccine: string;
}

export interface Answer {
  id: string;
  question: string;
  answer_text: string;
  answer_order: number;
}

export interface Photo {
  id: string;
  photo_url: string;
  photo_order: number;
}