import { PrivateProfile } from "@/api/my-profile/types";
import { LocationView } from "@/components/location-view";
import { StackHeaderV4 } from "@/components/stack-header-v4";
import { useEdit } from "@/store/edit";
import { LocationData } from "@/types/location";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

export default function Page() {
  const { edits, setEdits } = useEdit();
  const [selectedLocation, setSelectedLocation] = useState<LocationData>({
    latitude: edits?.latitude || null,
    longitude: edits?.longitude || null,
    neighborhood: edits?.neighborhood || null,
  });

  const handleLocationChange = (location: LocationData | null) => {
    if (location) {
      setSelectedLocation(location);
    } else {
      setSelectedLocation({
        latitude: null,
        longitude: null,
        neighborhood: "",
      });
    }
  };

  const handlePress = () => {
    if (
      selectedLocation.latitude !== null &&
      selectedLocation.longitude !== null &&
      selectedLocation.neighborhood !== null
    ) {
      setEdits({
        ...edits,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        neighborhood: selectedLocation.neighborhood,
      } as PrivateProfile);
    }
    router.back();
  };

  return (
    <View className="flex-1 bg-white p-5">
      <StackHeaderV4 title="Location" onPressBack={handlePress} />
      <Text className="text-[13px] text-neutral-400 mt-4 leading-relaxed">
        Only your neighborhood name will be visible on your profile — your exact
        location stays private.
      </Text>
      {/* Instruction label */}
      <Text className="text-[13px] tracking-wide text-[#7454F6] mt-8 mb-2">
        SELECT YOUR AREA
      </Text>
      <Text className="text-[14px] font-poppins-medium text-[#7454F6] mb-1">
        Move the map to select your location.
      </Text>
      <LocationView
        location={selectedLocation}
        onLocationChange={handleLocationChange}
      />
      {/* Helper text */}
      <Text className="text-[12px] text-neutral-400 mt-4 leading-relaxed">
        Drag or zoom the map to fine-tune your neighborhood selection.
      </Text>
    </View>
  );
}
