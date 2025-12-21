import { Link, Stack } from "expo-router";
import { Pressable, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  return (
    <View className="flex-1 bg-white overflow-hidden">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />

      {/* ===== Background Gradient Wash ===== */}
      <View className="absolute inset-0 bg-gradient-to-b from-[#FAF8FF] via-white to-[#F9FAFF]" />

      {/* ===== Organic Doodles / Blobs ===== */}
      <View className="absolute -top-24 -right-24 w-80 h-80 bg-[#EDE7FF] rounded-full opacity-40 blur-3xl" />
      <View className="absolute top-40 -left-32 w-96 h-96 bg-[#EAF2FF] rounded-full opacity-30 blur-3xl" />
      <View className="absolute -bottom-32 right-[-80] w-[420px] h-[420px] bg-[#F2FFE9] rounded-full opacity-30 blur-3xl" />

      <SafeAreaView className="flex-1 px-10">
        {/* ===== BRAND HEADER ===== */}
        <View className="pt-16 pb-8 items-center">
          {/* Watermark */}
          <Text
            className="absolute text-[78px] font-poppins-bold text-black/5"
            style={{ letterSpacing: 12 }}
          >
            SOUL SETU
          </Text>

          {/* Logo */}
          <Text
            className="text-[#1A1A1A] text-[30px] font-poppins-semibold"
            style={{ letterSpacing: 2.5 }}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            SoulSetu
          </Text>

          {/* Accent underline */}
          <View className="mt-2 h-[3px] w-14 bg-[#7454F6] rounded-full opacity-80" />
        </View>

        {/* ===== HERO CONTENT ===== */}
        <View className="flex-1 items-center justify-center -mt-4">
          <Text className="text-[#111] text-[36px] font-poppins-semibold text-center leading-tight">
            Find Connections
            {"\n"}
            That{" "}
            <Text className="text-[#7454F6] underline underline-offset-4">
              Matter
            </Text>
          </Text>

          <Text
            className="text-center text-[#5F5F5F] mt-6 text-lg font-poppins-medium"
            style={{ letterSpacing: 1.5 }}
          >
            Connect <Text className="text-[#7454F6]">·</Text> Feel{" "}
            <Text className="text-[#7454F6]">·</Text> Belong
          </Text>
        </View>

        {/* ===== CTA ===== */}
        <Link href="/phone" asChild>
          <Pressable
            className="h-[56px] w-full max-w-[280px] self-center mb-28 rounded-xl items-center justify-center active:scale-[0.97]"
            style={{
              backgroundColor: "#7454F6",
              shadowColor: "#7454F6",
              shadowOpacity: 0.28,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 8 },
              elevation: 10,
            }}
          >
            {/* Gradient Surface */}
            <View className="absolute inset-0 rounded-xl overflow-hidden">
              <View className="absolute inset-0 bg-gradient-to-br from-[#7B5AF7] via-[#8E73FF] to-[#6F4EF6]" />
              <View className="absolute inset-0 bg-gradient-to-t from-black/12 to-transparent" />

              {/* Soft highlight */}
              <View className="absolute -top-20 -right-20 w-36 h-36 bg-white/10 rounded-full blur-2xl" />
            </View>

            {/* Button Text */}
            <Text className="text-white text-[16px] font-poppins-semibold tracking-wide relative z-10">
              Get Started
            </Text>

            {/* Minimal directional hint */}
            <View className="absolute right-4 opacity-60">
              <View className="w-6 h-6 rounded-full border border-white/35 items-center justify-center">
                <View className="w-2 h-2 rounded-full bg-white" />
              </View>
            </View>
          </Pressable>
        </Link>
      </SafeAreaView>
    </View>
  );
}
