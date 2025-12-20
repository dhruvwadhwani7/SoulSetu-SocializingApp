import { PRIVACY_POLICY } from "@/constants/other";
import { StackHeaderV2 } from "@/components/stack-header-v2";
import { ScrollView, Text, View } from "react-native";

export default function Page() {
  const lines = PRIVACY_POLICY.split("\n").filter((l) => l.trim() !== "");

  return (
    <View className="flex-1 bg-white">
      <StackHeaderV2 title="Privacy Policy" />

      <ScrollView
        className="px-5 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {lines.map((line, index) => {
          if (line.startsWith("##")) {
            return (
              <Text
                key={index}
                className="text-2xl font-poppins-semibold text-[#7454F6] mb-4"
              >
                {line.replace("##", "").trim()}
              </Text>
            );
          }

          if (line.startsWith("###")) {
            return (
              <Text
                key={index}
                className="text-lg font-poppins-semibold text-[#5A3FE3] mt-5 mb-2"
              >
                {line.replace("###", "").trim()}
              </Text>
            );
          }

          if (line.startsWith("-")) {
            return (
              <Text
                key={index}
                className="text-[15px] font-poppins-regular text-neutral-700 mb-2 ml-3"
              >
                • {line.replace("-", "").trim()}
              </Text>
            );
          }

          return (
            <Text
              key={index}
              className="text-[15px] font-poppins-light text-neutral-700 leading-6 mb-3"
            >
              {line}
            </Text>
          );
        })}

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
