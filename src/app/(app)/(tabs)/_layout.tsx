import { Tabs } from "expo-router";
import colors from "tailwindcss/colors"
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return <Tabs 
  screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.neutral[950],
        },
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.neutral[500],
        tabBarShowLabel: false,
      }}>
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
    <Tabs.Screen name="profile"
     options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" color={color} size={size} />
          ),
          headerShown: false,
        }}/>  
  </Tabs>;
}
