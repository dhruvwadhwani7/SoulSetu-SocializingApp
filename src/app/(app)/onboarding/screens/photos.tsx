import { View, Text } from "react-native";

import { useMemo } from "react";

import { useEdit } from "@/store/edit";

import {

  StepFooter,
  StepHeader,
  StepLayout,

} from "@/components/onboarding";
import { OnboardingPhotoGrid } from "../components/OnboardingPhotoGrid";


export default function Page(){

  const { edits } = useEdit();

  const photoCount = useMemo(

    () => edits?.photos?.length ?? 0,

    [edits?.photos]

  );

  const hasMinimumPhotos = photoCount >= 3;

  return(

    <StepLayout

      header={

        <StepHeader

          stepName="photos"

          title="Add your photos"

          subtitle="Upload at least 3 photos"

        />

      }

      footer={

        <StepFooter

          nextRoute="/(app)/onboarding/screens/profile-preview"

          showSkip={false}

          disabled={!hasMinimumPhotos}

        />

      }

    >

      <View className="pt-2 pb-28">

        <OnboardingPhotoGrid />

        <Text className="text-neutral-500 text-sm mt-4">

          {photoCount}/3 photos added

        </Text>

      </View>

    </StepLayout>

  );

}