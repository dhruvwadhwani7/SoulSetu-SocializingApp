import { View, Text } from "react-native";

import { useEdit } from "@/store/edit";

import { AnswerList } from "@/components/profileView/answer-list";
import { StepFooter, StepHeader, StepLayout } from "@/components/onboarding";

export default function Page() {
  const { edits } = useEdit();

  const answerCount = edits?.answers?.length || 0;

  return (
    <StepLayout
      header={
        <StepHeader
          stepName="prompts"
          title="Add Prompts"
          subtitle="Show more about your personality"
        />
      }
      footer={
        <StepFooter
          nextRoute="/(app)/onboarding/profile-preview"
          showSkip={true}
        />
      }
    >
      <View className="mt-4">
        <AnswerList profile={edits} />

        <Text className="text-neutral-500 text-sm mt-3">
          {answerCount} prompts answered
        </Text>
      </View>
    </StepLayout>
  );
}
