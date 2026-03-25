import { View, Text } from "react-native";
import { useMemo } from "react";

import { useEdit } from "@/store/edit";

import { PhotoGrid } from "@/components/profileView/photo-grid";
import { StepFooter, StepHeader, StepLayout } from "@/components/onboarding";

export default function Page() {
  const { edits } = useEdit();

  const photoCount = useMemo(() => {
    if (!edits?.photos) return 0;

    return edits.photos.filter(Boolean).length;
  }, [edits?.photos]);

  const isValid = photoCount >= 3;

  return (
    <StepLayout
      header={
        <StepHeader
          stepName="photos"
          title="Add Photos"
          subtitle="Upload at least 3 photos"
        />
      }
      footer={
        <StepFooter
          nextRoute="/(app)/onboarding/prompts"
          showSkip={false}
          disabled={!isValid}
        />
      }
    >
      <View className="mt-4">
        <PhotoGrid profile={edits} />

        <Text className="text-neutral-500 text-sm mt-3">
          {photoCount}/3 photos added
        </Text>

        {!isValid && (
          <Text className="text-red-500 text-xs mt-2">
            Minimum 3 photos required
          </Text>
        )}
      </View>
    </StepLayout>
  );
}
