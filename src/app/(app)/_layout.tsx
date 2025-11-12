import { useAuth } from "@/store/auth";
import { Redirect, Stack } from "expo-router";
import { Text } from "react-native";

export default function Layout() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <Text>Loading....</Text>;
  }

  if (!session) {
    return <Redirect href={"/sign-in"} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ animation: "none" }} />
      <Stack.Screen
        name="settings"
        options={{ animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name="profile"
        options={{ animation: "slide_from_bottom" }}
      />
    </Stack>
  );
}
