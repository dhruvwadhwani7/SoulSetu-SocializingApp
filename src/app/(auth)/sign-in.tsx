import { Link, Stack } from "expo-router";
import { Pressable, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <StatusBar barStyle={"dark-content"} />

      {/* Soft minimal doodles (subtle iOS-style blurred circles) */}
      <View className="absolute top-[-40] right-[-40] w-52 h-52 bg-[#F6EFFF] rounded-full opacity-40 blur-3xl" />
      <View className="absolute top-[80] left-[-60] w-64 h-64 bg-[#EAF2FF] rounded-full opacity-35 blur-3xl" />
      <View className="absolute bottom-[-40] right-[-50] w-72 h-72 bg-[#F3FFE8] rounded-full opacity-30 blur-3xl" />

      <SafeAreaView className="flex-1 px-10">
        {/* === SOUL SETU HEADER === */}
        <View className="pt-14 pb-6 items-center">
          {/* Background large blurred text */}
          <Text
            className="absolute text-[72px] font-poppins-bold text-[#000]/5"
            style={{ letterSpacing: 10 }}
          >
            SOUL SETU
          </Text>

          {/* Foreground logo text */}
          <Text
            className="text-[#1A1A1A] text-[32px] font-poppins-bold"
            style={{ letterSpacing: 4 }}
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            SoulSetu
          </Text>

          {/* Subtle purple underline */}
          <View className="mt-1 h-[3px] w-12 bg-[#7454F6] rounded-full opacity-70" />
        </View>

        {/* Main Body */}
        <View className="flex-1 items-center justify-center -mt-6">
          {/* Heading */}
          <Text
            numberOfLines={3}
            adjustsFontSizeToFit
            className="text-[#111] text-[34px] font-poppins-semibold text-center leading-snug"
          >
            Find Connections
            {"\n"}
            That <Text className="text-[#7454F6]">Matter</Text>
          </Text>

          {/* Subtext */}
          <Text
            className="text-center text-[#5A5A5A] mt-5 text-lg font-poppins-semibold italic"
            style={{ letterSpacing: 2, opacity: 0.9 }}
          >
            Connect <Text className="text-[#7454F6]">·</Text> Feel{" "}
            <Text className="text-[#7454F6]">·</Text> Belong
          </Text>
        </View>

        {/* CTA Button */}
        <Link href={"/phone"} asChild>
          <Pressable className="bg-[#7454F6] h-16 mb-24 items-center justify-center rounded-2xl w-3/4 self-center shadow-md shadow-[#7454F6]/20">
            <Text className="text-white text-lg font-poppins-medium">
              Get Started
            </Text>
          </Pressable>
        </Link>
      </SafeAreaView>
    </View>
  );
}
