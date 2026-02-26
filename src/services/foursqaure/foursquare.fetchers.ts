// services/foursquare/foursquare.fetchers.ts

import {
  fsqSearch,
  fsqDetails,
} from "./foursquare.api";
import {
  FoursquarePlace,
  FoursquarePlaceDetails,
} from "../../types/foursqaure/foursqaure.types";

/** Nearby places list */
export async function fetchNearbyPlaces(
  lat: number,
  lng: number
): Promise<FoursquarePlace[]> {
  const data = await fsqSearch(lat, lng);

  return (data.results || []).map((p: any) => ({
    id: p.fsq_place_id,
    name: p.name,
    category: p.categories?.[0]?.name,
    address: p.location?.formatted_address,
    distance: p.distance,
    website: p.website,
  }));
}

/** Place details */
export async function fetchPlaceDetails(
  id: string
): Promise<FoursquarePlaceDetails> {
  const d = await fsqDetails(id);

  return {
    id: d.fsq_place_id,
    name: d.name,
    category: d.categories?.[0]?.name,
    address: d.location?.formatted_address,
    website: d.website,
    tel: d.tel,
    rating: d.rating,
    description: d.description,
  };
}