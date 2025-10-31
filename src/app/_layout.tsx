import { Stack } from "expo-router";
import '../../global.css';
import { StackScreen } from "react-native-screens";

export default function Layout() {
  return <Stack
  screenOptions={{
    headerShown:false
  }}>
    <Stack.Screen name="(app)"/>
  </Stack>;
}