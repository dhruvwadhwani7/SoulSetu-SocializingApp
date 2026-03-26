import { StepFooter, StepLayout } from "@/components/onboarding";

import { View, Text } from "react-native";

export default function Page() {
  return (
    <StepLayout
      header={null}
      footer={
        <StepFooter
          nextRoute="/(app)/onboarding/screens/basic-info"
          showSkip={false}
          buttonLabel="Start onboarding"
        />
      }
    >
      <View className="flex-1 justify-center items-center px-8">
        {/* logo style title */}

        <Text className="text-[16px] text-neutral-400 tracking-wide mb-1">
          Welcome to
        </Text>

        <Text className="text-[42px] font-bold text-[#7454F6]">SoulSetu</Text>

        {/* tagline */}

        <Text className="text-neutral-500 text-center mt-6 leading-6 text-[15px]">
          Build your profile to discover
          {"\n"}
          meaningful connections near you
        </Text>

        {/* decorative space */}

        <View className="h-24" />
      </View>
    </StepLayout>
  );
}
