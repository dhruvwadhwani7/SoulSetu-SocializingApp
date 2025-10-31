import { SplashScreen, Stack } from "expo-router";
import { cssInterop } from "nativewind";
import { VideoView } from "expo-video";
import "../../global.css";
import { fonts } from "@/constants/fonts"
import { useEffect } from "react";
import { useFonts } from 'expo-font'

cssInterop(VideoView, { className: { target: "style" } });

export default function Layout() {
  const [loaded, error] = useFonts(fonts);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(app)" />
    </Stack>
  );
}
