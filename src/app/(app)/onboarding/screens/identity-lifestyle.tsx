import { ScrollView, View } from "react-native";

import { useEdit } from "@/store/edit";

import { StepFooter, StepHeader, StepLayout } from "@/components/onboarding";

import { List } from "@/components/shared/list";

import { onboardingIdentityLifestyle } from "@/utils/onboarding/identity";

import { emptyProfile } from "@/utils/profile/emptyProfile";

export default function Page() {
  const { edits } = useEdit();

  return (
    <StepLayout
      header={
        <StepHeader
          stepName="identity-lifestyle"
          title="Identity & lifestyle"
          subtitle="Optional but improves matches"
        />
      }
      footer={
        <StepFooter
          nextRoute="/(app)/onboarding/screens/location"
          showSkip={true}
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
            title="Identity & Lifestyle"
            data={onboardingIdentityLifestyle}
            profile={edits ?? emptyProfile}
          />
        </View>
      </ScrollView>
    </StepLayout>
  );
}
