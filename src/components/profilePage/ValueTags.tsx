import { Text, View } from "react-native";

const VALUES = ["Intentional Connections", "Emotional", "Shared Values"];

export default function ValueTags() {
  return (
    <View className="relative mt-10 px-6">
      <View className="absolute -top-10 right-4 w-52 h-52 bg-[#EDE4FF] rounded-full opacity-30 blur-3xl" />

      <View className="flex-row flex-wrap justify-center gap-4">
        {VALUES.map((label) => (
          <View
            key={label}
            className="
              px-5 py-2.5
              rounded-full
              bg-white/60
              backdrop-blur-2xl
              border border-white/40
            "
            style={{
              shadowColor: "#5A3FE3",
              shadowOpacity: 0.12,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text className="text-[12px] font-poppins-medium text-[#5A3FE3] tracking-wide">
              {label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}