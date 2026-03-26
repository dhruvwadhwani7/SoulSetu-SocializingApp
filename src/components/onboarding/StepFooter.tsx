import { View, Text, Pressable } from "react-native";

import { router, Href } from "expo-router";

type StepFooterProps = {
  nextRoute: Href;

  showSkip: boolean;

  disabled?: boolean;

  onNext?: () => boolean | void;

  buttonLabel?: string;
};

export default function StepFooter({
  nextRoute,
  showSkip,
  disabled,
  onNext,
  buttonLabel = "Next",
}: StepFooterProps) {
  const handleNext = () => {
    if (onNext) {
      const result = onNext();

      if (result === false) {
        return;
      }
    }

    router.push(nextRoute);
  };

  return (
    <View className="px-6 pb-10 pt-6 bg-white">
      {showSkip && (
        <Pressable
          onPress={() => router.push(nextRoute)}
          className="h-[44px] items-center justify-center mb-3"
        >
          <Text className="text-neutral-500 text-[15px]">Skip</Text>
        </Pressable>
      )}

      <Pressable
        disabled={disabled}
        onPress={handleNext}
        className={`h-[54px] rounded-xl items-center justify-center ${
          disabled ? "bg-neutral-300" : "bg-[#7454F6]"
        }`}
      >
        <Text className="text-white font-semibold text-[15px]">
          {buttonLabel}
        </Text>
      </Pressable>
    </View>
  );
}
