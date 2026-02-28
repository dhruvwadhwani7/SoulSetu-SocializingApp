export async function fetchNearbyOSMPlaces(
  lat: number,
  lng: number,
  radiusMeters: number
) {
  const query = `
  [out:json];
  (
    node["amenity"~"cafe|restaurant|fast_food"](around:${radiusMeters},${lat},${lng});
    node["leisure"="park"](around:${radiusMeters},${lat},${lng});
  );
  out body;
  `;

  const url = "https://overpass-api.de/api/interpreter";

  console.log("📍 OSM fetch start", { lat, lng, radiusMeters });

  const res = await fetch(url, {
    method: "POST",
    body: query,
  });

  const json = await res.json();

  console.log("📍 OSM raw response count:", json.elements?.length ?? 0);

  return json.elements.map((el: any) => ({
    id: String(el.id),
    lat: el.lat,
    lng: el.lon,
    name: el.tags?.name ?? "Unnamed",
    type: el.tags?.amenity ?? el.tags?.leisure ?? "place",
  }));
}