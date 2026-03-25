import { StepFooter, StepHeader, StepLayout } from "@/components/onboarding";
import { View, Text } from "react-native";

export default function Page() {
  return (
    <StepLayout
      header={<StepHeader stepName="welcome" title="" />}
      footer={
        <StepFooter nextRoute="/(app)/onboarding/basic-info" showSkip={false} />
      }
    >
      <View className="flex-1 justify-center items-center">
        <Text className="text-[34px] font-semibold text-center">
          Welcome to
        </Text>

        <Text className="text-[36px] font-bold text-[#7454F6] mt-1">
          SoulSetu
        </Text>

        <Text className="text-neutral-500 text-center mt-4 px-6 leading-6">
          Let’s build your profile to start discovering meaningful connections.
        </Text>
      </View>
    </StepLayout>
  );
}
