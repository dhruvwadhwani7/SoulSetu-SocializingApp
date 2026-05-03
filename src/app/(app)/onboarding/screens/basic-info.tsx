import { ScrollView, View } from "react-native";

import { useEdit } from "@/store/edit";

import { StepFooter, StepHeader, StepLayout } from "@/components/onboarding";

import { List } from "@/components/shared/list";

// import { vitals } from "@/utils/profile/vitals";
import { emptyProfile } from "@/utils/profile/emptyProfile";
import { onboardingVitals } from "@/utils/onboarding/vitals";

export default function Page() {
  const { edits } = useEdit();

  const hasRequiredFields =
    Boolean(edits?.first_name?.trim()) && Boolean(edits?.dob) && Boolean(edits?.gender?.id);

  return (
    <StepLayout
      header={
        <StepHeader
          stepName="basic-info"
          title="Basic information"
          subtitle="Tell us about yourself"
        />
      }
      footer={
        <StepFooter
          nextRoute="/(app)/onboarding/screens/identity-lifestyle"
          showSkip={false}
          disabled={!hasRequiredFields}
        />
      }
    >
      <ScrollView
        className="flex-1 bg-white"
        contentContainerClassName="pb-28"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-6">
          <List
            title="My Vitals"
            data={onboardingVitals}
            profile={edits ?? emptyProfile}
          />
        </View>
      </ScrollView>
    </StepLayout>
  );
}
