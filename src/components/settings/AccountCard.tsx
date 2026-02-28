import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";

export default function AccountCard({ profile }: any) {
  return (
    <Pressable
      onPress={() => router.push("/(app)/profile/(tabs)")}
      className="mb-4"
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.98 : 1 }],
        opacity: pressed ? 0.92 : 1,
      })}
    >
      <View
        className="bg-white rounded-3xl border border-neutral-200 px-5 py-5 flex-row items-center justify-between"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 14,
          elevation: 3,
        }}
      >
        <View className="flex-1 pr-4">
          <Text className="text-[17px] font-poppins-semibold text-neutral-900">
            {profile?.first_name}
          </Text>

          <Text className="text-[14px] text-neutral-600 mt-1">
            +{profile?.phone}
          </Text>

          <Text className="text-[12px] text-neutral-400 mt-1 tracking-wide">
            {profile?.neighborhood}
          </Text>
        </View>

        <View
          className="h-20 w-20 rounded-full bg-white p-[3px]"
          style={{
            borderColor: "#7454F6",
            borderWidth: 2,
            shadowColor: "#7454F6",
            shadowOpacity: 0.28,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <View className="flex-1 rounded-full overflow-hidden bg-neutral-200">
            <Image source={profile?.avatar_url} className="flex-1" contentFit="cover" />
          </View>
        </View>
      </View>
    </Pressable>
  );
}