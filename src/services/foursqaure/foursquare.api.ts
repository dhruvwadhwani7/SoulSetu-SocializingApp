const API_KEY = process.env.EXPO_PUBLIC_FOURSQUARE_API_KEY;

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "X-Places-Api-Version": "2025-06-17",
  Accept: "application/json",
};

/** Search nearby places */
export async function fsqSearch(lat: number, lng: number) {
  const res = await fetch(
    `https://places-api.foursquare.com/places/search?ll=${lat},${lng}&radius=3000&limit=20`,
    { headers }
  );

  const data = await res.json();
  // console.log("FSQ SEARCH:", data);

  if (!res.ok) throw new Error("Foursquare search error");
  return data;
}

/** Place details */
export async function fsqDetails(id: string) {
  const res = await fetch(
    `https://places-api.foursquare.com/places/${id}`,
    { headers }
  );

  const data = await res.json();
  // console.log("FSQ DETAILS:", data);

  if (!res.ok) throw new Error("Foursquare details error");
  return data;
}

/** Geotagging candidates (optional verification) */
export async function fsqGeotagCandidates(lat: number, lng: number) {
  const res = await fetch(
    `https://places-api.foursquare.com/geotagging/candidates?ll=${lat},${lng}`,
    { headers }
  );

  const data = await res.json();
  // console.log("FSQ GEOTAG:", data);

  if (!res.ok) throw new Error("Foursquare geotag error");
  return data;
}