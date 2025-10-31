import { Redirect, Stack } from "expo-router";

export default function Layout() {
  return <Redirect href={"/sign-in"} />;
  return;
  <Stack
    screenOptions={{
      headerShown: false,
    }}
  ></Stack>;
}
