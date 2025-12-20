import { useAuth } from "@/store/auth";
import { Redirect, Stack } from "expo-router";

export default function Layout() {
  const { session } = useAuth();

  if (session) {
    return <Redirect href={"/(app)/(tabs)"} />;
  }

  return (
    <Stack>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="phone" />
      <Stack.Screen name="otp" />
    </Stack>
  );
}