import { Place } from "../types/places";

const API_KEY = process.env.EXPO_PUBLIC_FOURSQUARE_API_KEY;

export async function fetchPlaces(lat: number, lng: number): Promise<Place[]> {
  const url = `https://places-api.foursquare.com/places/search?ll=${lat},${lng}&radius=3000&categories=13032,13065&limit=10`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "X-Places-Api-Version": "2025-06-17",
      Accept: "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error("Foursquare error");

  return (data.results || []).map(
    (p: any): Place => ({
      id: p.fsq_id,
      name: p.name,
      category: p.categories?.[0]?.name,
      address: p.location?.formatted_address ?? "Unknown location",
      distance: p.distance,
      website: p.website,
    }),
  );
}
