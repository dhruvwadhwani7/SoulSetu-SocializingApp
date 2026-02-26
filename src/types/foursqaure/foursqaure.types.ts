export type FoursquarePlace = {
  id: string;
  name: string;
  category?: string;
  address?: string;
  distance?: number;
  website?: string;
};

export type FoursquarePlaceDetails = {
  id: string;
  name: string;
  category?: string;
  address?: string;
  website?: string;
  tel?: string;
  rating?: number;
  description?: string;
};