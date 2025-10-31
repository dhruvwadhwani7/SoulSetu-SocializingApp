import { Pressable, StatusBar, Text, View } from "react-native";
import { VideoBackground } from "@/components/video-background";
import { Link, Stack } from "expo-router";
import Logo from "~/assets/images/soul-setu-logo.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "tailwindcss/colors";

export default function Page() {
  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <StatusBar barStyle={"light-content"} />
      <VideoBackground source={require("~/assets/images/background.mp4")}>
        <SafeAreaView className="flex-1 p-10">
          <View className="flex-1 items-center pt-14">
            <Logo fill={colors.white} width={150} height={57} />
            <View className="h-4" />
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              className="text-white text-3xl font-poppins-semibold text-center uppercase tracking-[6px]"
              style={{
                textShadowColor: "rgba(255, 255, 255, 0.25)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 6,
              }}
            >
              FIND · EXPLORE · ENJOY
            </Text>
          </View>
          <Link href={"/phone"} asChild>
            <Pressable className="bg-fuchsia-900 h-16 items-center justify-center rounded-full">
              <Text className="text-white text-lg font-poppins-semibold">
                Sign in with Phone Number
              </Text>
            </Pressable>
          </Link>
        </SafeAreaView>
      </VideoBackground>
    </View>
  );
}
