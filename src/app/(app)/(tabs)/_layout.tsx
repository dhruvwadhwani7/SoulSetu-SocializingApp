import Card from "@/components/assets/Card";
import Heart from "@/components/assets/Heart";
import Home from "@/components/assets/Home";
import Person from "@/components/assets/Person";
import { Tabs } from "expo-router";
import colors from "tailwindcss/colors";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#D9D9D9",
        },
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.black,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Home fill={color} />,
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          tabBarIcon: ({ color }) => <Heart fill={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Card fill={color} />,
        }}
      />
      <Tabs.Screen
        name="hinge"
        options={{
          tabBarIcon: ({ color }) => <Person fill={color} />,
        }}
      />
    </Tabs>
  );
}
