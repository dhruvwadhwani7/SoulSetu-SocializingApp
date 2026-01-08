import { useMyProfile } from "@/api/my-profile";
import { cn } from "@/utils/cn";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function Layout() {
  const { data: profile } = useMyProfile();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 20,
        },

        tabBarActiveTintColor: "#7454F6",
        tabBarInactiveTintColor: "#9CA3AF",
      }}
    >
      {/* ===== HOME ===== */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      {/* ===== LIKES ===== */}
      <Tabs.Screen
        name="likes"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" color={color} size={size} />
          ),
        }}
      />

      {/* ===== MATCHES ===== */}
      <Tabs.Screen
        name="matches"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" color={color} size={size} />
          ),
        }}
      />

      {/* ===== PROFILE (AVATAR TAB) ===== */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ size, focused, color }) =>
            profile?.avatar_url ? (
              <View
                style={{
                  width: size + 8,
                  height: size + 8,
                  borderRadius: 999,
                  padding: 2,
                  borderWidth: focused ? 2 : 0,
                  borderColor: "#7454F6",
                }}
              >
                <Image
                  source={profile.avatar_url}
                  className="flex-1 rounded-full bg-neutral-200"
                />
              </View>
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={size + 2}
                color={color}
              />
            ),
        }}
      />
    </Tabs>
  );
}
