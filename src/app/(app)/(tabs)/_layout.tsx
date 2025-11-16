import { Tabs } from "expo-router";
import colors from "tailwindcss/colors";
import { Ionicons } from "@expo/vector-icons";
import { useMyProfile } from "@/api/my-profile";
import { Image } from "expo-image";
import { View } from "react-native";
import { cn } from "@/utils/cn";

export default function Layout() {
  const { data: profile } = useMyProfile();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          height: 72,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -2 },
        },
        tabBarActiveTintColor: "#1A1A1A",
        tabBarInactiveTintColor: "#9E9E9E",
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={size + 2}
            />
          ),
        }}
      />

      {/* LIKES */}
      <Tabs.Screen
        name="likes"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              color={color}
              size={size + 2}
            />
          ),
        }}
      />

      {/* MATCHES */}
      <Tabs.Screen
        name="matches"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "chatbubbles" : "chatbubbles-outline"}
              color={color}
              size={size + 2}
            />
          ),
        }}
      />

      {/* PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size, focused }) => {
            if (!profile?.avatar_url) {
              return (
                <Ionicons
                  name={focused ? "person" : "person-outline"}
                  color={color}
                  size={size + 2}
                />
              );
            }

            return (
              <View
                style={{
                  width: size + 6,
                  height: size + 6,
                  borderRadius: 999,
                  padding: focused ? 2 : 0,
                  backgroundColor: focused ? "#7454F6" : "transparent",
                }}
              >
                <Image
                  source={profile.avatar_url}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 999,
                  }}
                />
              </View>
            );
          },
        }}
      />
    </Tabs>
  );
}
