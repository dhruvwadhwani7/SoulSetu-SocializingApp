import { Stack } from "expo-router";
import { StackScreen } from "react-native-screens";

export default function Layout() {
  return <Stack>
    <Stack.Screen name="sign-in"/>
    <Stack.Screen name="phone"/>
    <Stack.Screen name="otp"/>
  </Stack>;
}
