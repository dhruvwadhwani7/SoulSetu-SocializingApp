export interface Profile {
  id: string;
  first_name: string;
  photos: Photo[];
  answers: Answer[];
  traits: Trait[];

  /** Spotify */
  spotify_connected?: boolean;
  spotify_show_on_profile?: boolean;
  spotify_top_artists?: SpotifyArtist[];
}

export interface SpotifyArtist {
  id: string;
  name: string;
  image?: string;
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