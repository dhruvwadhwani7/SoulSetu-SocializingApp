import NearbyMap from "@/components/osm/NearbyMap";
import PlaceTypeFilter, { PlaceType } from "@/components/osm/PlaceTypeFilter";
import RadiusSelector from "@/components/osm/RadiusSelector";
import { StackHeaderV2 } from "@/components/shared/stack-header-v2";
import { useNearbyOSM } from "@/hooks/useNearbyOSM";
import { Stack } from "expo-router";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";

export default function NearbyPlacesMapPage() {
  const { places, radiusKm, setRadiusKm, lat, lng, fetching } = useNearbyOSM();

  const [type, setType] = useState<PlaceType>("cafe");

  const filteredPlaces = useMemo(() => {
    return places.filter((p: any) => {
      if (type === "restaurant") {
        return p.type === "restaurant" || p.type === "fast_food";
      }
      return p.type === type;
    });
  }, [places, type]);

  if (!lat || !lng) return null;

  return (
    <View className="flex-1 bg-white">
      <StackHeaderV2 title="Nearby Places" />
      <Stack.Screen options={{ title: "Nearby" }} />

      <View className="px-5 pt-1 pb-3">
        <Text className="text-[16px] font-poppins-semibold text-black">
          Find nearby cafés, restaurants & parks
        </Text>

        <Text className="text-[12px] mt-1">
          Discover beautiful spots around you in real-time
        </Text>
      </View>

      <PlaceTypeFilter selected={type} onChange={setType} />

      <RadiusSelector
        value={radiusKm}
        onChange={setRadiusKm}
        loading={fetching}
      />

      <View className="flex-1">
        <NearbyMap lat={lat} lng={lng} places={filteredPlaces} />
      </View>
    </View>
  );
}
