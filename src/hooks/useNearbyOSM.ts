import { useMyProfile } from "@/api/my-profile";
import { useQuery } from "@tanstack/react-query";
import { fetchNearbyOSMPlaces } from "@/services/osm/osmNearby";
import { useState } from "react";

export function useNearbyOSM() {
  const { data: profile } = useMyProfile();
  const lat = profile?.latitude;
  const lng = profile?.longitude;

  const [radiusKm, setRadiusKm] = useState(5);

  const query = useQuery({
    queryKey: ["osmNearby", lat, lng, radiusKm],
    queryFn: () =>
      fetchNearbyOSMPlaces(lat!, lng!, radiusKm * 1000),
    enabled: !!lat && !!lng,
  });

  return {
    places: query.data ?? [],
    loading: query.isLoading,
    fetching: query.isFetching,   
    radiusKm,
    setRadiusKm,
    lat,
    lng,
  };
}