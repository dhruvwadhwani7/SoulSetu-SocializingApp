import { useMyProfile } from "@/api/my-profile";
import { cn } from "@/utils/cn";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { View } from "react-native";
import colors from "tailwindcss/colors";

export default function Layout() {
  const { data: profile } = useMyProfile();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.neutral[950],
        },
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.neutral[500],
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbox-outline" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="hinge"
        options={{
          tabBarIcon: ({ color, size, focused }) =>
            profile && profile.avatar_url ? (
              <View
                style={{
                  width: size,
                  height: size,
                }}
                className={cn(
                  focused && "border border-white rounded-full p-0.5"
                )}
              >
                <Image
                  source={profile.avatar_url}
                  className="flex-1 aspect-square rounded-full bg-neutral-200"
                />
              </View>
            ) : (
              <Ionicons name="person-circle" color={color} size={size} />
            ),
        }}
      />
    </Tabs>
  );
}
