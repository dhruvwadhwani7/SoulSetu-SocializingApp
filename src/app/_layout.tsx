import { SplashScreen, Stack } from "expo-router";
import { cssInterop } from "nativewind";
import { VideoView } from "expo-video";
import "../../global.css";
import { fonts } from "@/constants/fonts";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

cssInterop(VideoView, { className: { target: "style" } });
cssInterop(Ionicons, { className: { target: "style" } });

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();
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
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(app)" />
      </Stack>
    </QueryClientProvider>
  );
}
