import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  return (
    <View className="flex-1 bg-[#FAFAFB]">
      {/* Ambient background glow */}
      <View className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-[#EFEAFF] opacity-35 blur-[160px]" />

      {/* ===== SAFE HEADER (same as Matches) ===== */}
      <SafeAreaView edges={["top"]}>
        <View className="px-6 pt-4 pb-4">
          <Text className="text-[28px] font-poppins-semibold text-[#111]">
            Bluetooth Mode
          </Text>

          <Text className="text-[13px] text-neutral-500 mt-1">
            Discover Nearby People Using Bluetooth
          </Text>

          <View className="mt-4 h-px bg-neutral-200/70" />
        </View>
      </SafeAreaView>
    </View>
  );
}
