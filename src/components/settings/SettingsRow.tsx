import { Text, TouchableOpacity } from "react-native";

export default function SettingsRow({
  label,
  onPress,
  noBorder,
}: {
  label: string;
  onPress: () => void;
  noBorder?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`py-4 px-4 ${!noBorder ? "border-b border-neutral-200" : ""}`}
    >
      <Text className="text-[15px] text-[#111] font-poppins-regular">
        {label}
      </Text>
    </TouchableOpacity>
  );
}