import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

export default function HeaderIcon({ icon }: { icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <View
      className="h-10 w-10 rounded-full items-center justify-center bg-white/60 border border-white/40"
      style={{
        shadowColor: "#7454F6",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      <Ionicons name={icon} size={18} color="#5A5A5A" />
    </View>
  );
}