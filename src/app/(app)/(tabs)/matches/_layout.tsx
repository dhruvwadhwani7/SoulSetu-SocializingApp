import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // you control headers manually
        contentStyle: {
          backgroundColor: "#FAFAFB", // consistent soft background
        },

        /* iOS-style premium transitions */
        animation: Platform.OS === "ios" ? "slide_from_right" : "fade",

        /* Gesture polish */
        gestureEnabled: true,
        gestureDirection: "horizontal",

        /* Remove default shadows */
        headerShadowVisible: false,

        /* Smooth keyboard behavior */
        keyboardHandlingEnabled: true,
      }}
    />
  );
}
