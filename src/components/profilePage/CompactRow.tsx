import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function CompactRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string | null;
}) {
  return (
    <View className="flex-row items-center py-3 px-3">
      <Ionicons name={icon} size={17} color="#8A8A8A" />

      <Text className="ml-3 text-[14px] text-[#444]">
        {label}
        <Text className="text-neutral-400"> · </Text>
        <Text className="font-poppins-medium text-[#111]">
          {value || "Not added"}
        </Text>
      </Text>
    </View>
  );
}