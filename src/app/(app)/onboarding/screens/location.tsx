import { View, Text } from "react-native";

import { useEdit } from "@/store/edit";
import { PrivateProfile } from "@/api/my-profile/types";

import { useState } from "react";
import { LocationView } from "@/components/shared/location-view";
import { StepFooter, StepHeader, StepLayout } from "@/components/onboarding";

export default function Page() {
  const { edits, setEdits } = useEdit();

  const [error, setError] = useState(false);

  const updateLocation = (value: any) => {
    setEdits({
      ...edits,
      location: value,
    } as PrivateProfile);

    setError(false);
  };

  const validate = () => {
    if (!edits?.location?.latitude) {
      setError(true);
      return false;
    }

    return true;
  };

  return (
    <StepLayout
      header={
        <StepHeader
          stepName="location"
          title="Your Location"
          subtitle="Used to show nearby matches"
        />
      }
      footer={
        <StepFooter
          nextRoute="/(app)/onboarding/photos"
          showSkip={false}
          disabled={!validate()}
        />
      }
    >
      <View className="mt-4">
        <LocationView value={edits?.location} onChange={updateLocation} />

        {error && (
          <Text className="text-red-500 text-xs mt-2">
            Location is required
          </Text>
        )}
      </View>
    </StepLayout>
  );
}
