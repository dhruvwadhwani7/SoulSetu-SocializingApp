import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,

        headerShadowVisible: false,

        headerTitleAlign: "center",

        animation: "slide_from_right",

        contentStyle: {
          backgroundColor: "#fff",
        },
      }}
    />
  );
}
