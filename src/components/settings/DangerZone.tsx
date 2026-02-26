import { Text, TouchableOpacity } from "react-native";

export default function DangerZone({ onDelete }: { onDelete: () => void }) {
  return (
    <TouchableOpacity
      onPress={onDelete}
      className="w-full py-4 rounded-2xl bg-white border border-red-200 mb-20"
    >
      <Text className="text-center text-[15px] font-poppins-semibold text-red-600">
        Delete Account Permanently
      </Text>
    </TouchableOpacity>
  );
}