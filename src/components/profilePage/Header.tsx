import { Text, View } from "react-native";
import { Link } from "expo-router";
import HeaderIcon from "./HeaderIcon";

export default function Header() {
  return (
    <View className="px-6 pt-6 pb-4 bg-white">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-[24px] font-poppins-semibold text-[#111]" style={{ letterSpacing: 2 }}>
            SoulSetu
          </Text>
          <Text className="text-[11px] text-neutral-400 tracking-widest mt-0.5">
            YOUR SPACE
          </Text>
        </View>

        <View className="flex-row items-center gap-4">
          <Link href="/preferences" suppressHighlighting>
            <HeaderIcon icon="options-outline" />
          </Link>

          <Link href="/settings" suppressHighlighting>
            <HeaderIcon icon="settings-outline" />
          </Link>
        </View>
      </View>
    </View>
  );
}