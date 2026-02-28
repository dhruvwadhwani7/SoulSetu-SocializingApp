import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";

export default function HeroProfile({ profile }: any) {
  const heroBackground = useMemo(() => {
    if (!profile?.photos?.length) return null;
    const index = Math.floor(Math.random() * profile.photos.length);
    return profile.photos[index]?.photo_url;
  }, [profile?.photos]);

  return (
    <Pressable onPress={() => router.push("/profile")} className="relative">
      {heroBackground && (
        <Image source={heroBackground} className="absolute inset-0 w-full h-full" contentFit="cover" blurRadius={40} />
      )}

      <View className="absolute inset-0 bg-black/35" />
      <View className="absolute inset-0 bg-[#7454F6]/10" />

      <View className="items-center pt-14 pb-8">
        <View
          style={{
            padding: 4,
            borderRadius: 9999,
            borderWidth: 2,
            borderColor: "#7454F6",
            shadowColor: "#7454F6",
            shadowOpacity: 0.25,
            shadowRadius: 24,
            elevation: 8,
          }}
        >
          <View style={{ padding: 3, borderRadius: 9999, backgroundColor: "#fff" }}>
            <Image
              source={profile?.avatar_url}
              className="h-36 w-36 rounded-full bg-neutral-200"
              contentFit="cover"
            />
          </View>
        </View>

        <Text className="text-[22px] font-poppins-semibold mt-5 text-white">
          {profile?.first_name}
        </Text>

        <Text className="text-[12px] text-white/80 tracking-wide mt-0.5">
          Tap profile to view & edit details
        </Text>

        {profile?.phone && (
          <View className="mt-3 px-4 py-1.5 rounded-full bg-white/90">
            <Text className="text-[15px] text-neutral-800 font-poppins-medium tracking-wide">
              +{profile.phone}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}