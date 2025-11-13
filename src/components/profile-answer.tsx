import { Answer } from "@/types/profile";
import { FC } from "react";
import { Text, View } from "react-native";

interface Props {
  answer: Answer;
}

export const ProfileAnswer: FC<Props> = ({ answer }) => {
  return (
    <View className="bg-white rounded-md px-5 pt-14 pb-20 gap-5 border border-neutral-200">
      <Text className="text-base font-poppins-medium">{answer?.question}</Text>
      <Text className="text-3xl font-playfair-semibold">
        {answer?.answer_text}
      </Text>
    </View>
  );
};