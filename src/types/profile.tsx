export interface Profile {
  id: string;
  first_name: string;
  photos: Photo[];
  answers: Answer[];
  traits: Trait[];
}

export interface Trait {
  key: string;
  icon: string;
  label: string | null;
}

export interface Photo {
  id: string;
  photo_url: string;
  photo_order: number;
}

export interface Answer {
  id: string;
  question: string;
  answer_text: string;
  answer_order: number;
}