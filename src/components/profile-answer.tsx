import { Answer } from "@/types/profile";
import { FC } from "react";
import { Text, View } from "react-native";

interface Props {
  answer: Answer;
}

export const ProfileAnswer: FC<Props> = ({ answer }) => {
  return (
    <View
      style={{
        backgroundColor: "rgba(255,255,255,0.75)",
        borderRadius: 18,
        paddingHorizontal: 20,
        paddingTop: 26,
        paddingBottom: 32,
        borderWidth: 1,
        borderColor: "rgba(210,200,255,0.45)",
        shadowColor: "#7454F6",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      }}
    >
      {/* Question */}
      <Text
        style={{
          fontSize: 15,
          fontFamily: "Poppins-Medium",
          color: "#666",
          opacity: 0.85,
          marginBottom: 6,
        }}
      >
        {answer?.question}
      </Text>

      {/* Answer – highlighted */}
      <Text
        style={{
          fontSize: 30,
          fontFamily: "PlayfairDisplay-SemiBold",
          color: "#2A2A2A",
          lineHeight: 38,
        }}
      >
        {answer?.answer_text}
      </Text>
    </View>
  );
};
