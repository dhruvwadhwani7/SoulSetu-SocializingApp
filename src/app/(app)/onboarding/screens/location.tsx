import { View, Text } from "react-native";
import { useState } from "react";

import { useEdit } from "@/store/edit";
import { PrivateProfile } from "@/api/my-profile/types";

import { LocationView } from "@/components/shared/location-view";

import { StepFooter, StepHeader, StepLayout } from "@/components/onboarding";

import { LocationData } from "@/types/location";

export default function Page() {
  const { edits, setEdits } = useEdit();

  const [error, setError] = useState(false);

  const [location, setLocation] = useState<LocationData>({
    latitude: edits?.latitude ?? null,

    longitude: edits?.longitude ?? null,

    neighborhood: edits?.neighborhood ?? null,
  });

  const handleLocationChange = (value: LocationData | null) => {
    if (!value) {
      setLocation({
        latitude: null,

        longitude: null,

        neighborhood: null,
      });

      return;
    }

    setLocation(value);

    setError(false);
  };

  const handleNext = () => {
    // location optional

    if (location?.latitude && location?.longitude) {
      setEdits({
        ...edits,

        latitude: location.latitude,

        longitude: location.longitude,

        neighborhood: location.neighborhood ?? "",
      } as PrivateProfile);
    }

    return true;
  };

  return (
    <StepLayout
      header={
        <StepHeader
          stepName="location"
          title="Your location"
          subtitle="Used to show nearby matches"
        />
      }
      footer={
        <StepFooter
          nextRoute="/(app)/onboarding/screens/photos"
          showSkip={true}
          onNext={handleNext}
        />
      }
    >
      <View className="pt-4">
        <Text className="text-[13px] text-neutral-400 mb-4">
          Only your neighborhood is visible publicly. Your exact coordinates
          stay private.
        </Text>

        <LocationView
          location={location}
          onLocationChange={handleLocationChange}
        />

        {error && (
          <Text className="text-red-500 text-xs mt-3">
            Could not detect location
          </Text>
        )}
      </View>
    </StepLayout>
  );
}
