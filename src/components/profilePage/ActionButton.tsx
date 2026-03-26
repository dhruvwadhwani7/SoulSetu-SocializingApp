import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { router, Href } from "expo-router";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route: Href;  
};

export default function ActionButton({ icon, label, route }: Props) {
  return (
    <Pressable onPress={() => router.push(route)} className="items-center">
      <View
        className="w-16 h-16 rounded-full bg-white items-center justify-center"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Ionicons name={icon} size={26} color="#7454F6" />
      </View>

      <Text className="mt-2 text-sm text-neutral-700 font-poppins-medium">
        {label}
      </Text>
    </Pressable>
  );
}