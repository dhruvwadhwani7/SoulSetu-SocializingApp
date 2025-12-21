import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { FC } from "react";
import { Pressable, View } from "react-native";

interface Props {
  title: string;
}

export const StackHeaderV2: FC<Props> = ({ title }) => {
  return (
    <Stack.Screen
      options={{
        title,
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerBackVisible: false,
        headerStyle: {
          backgroundColor: "rgba(255,255,255,0.96)",
        },
        headerTitleStyle: {
          fontFamily: "Poppins-SemiBold",
          fontSize: 17,
          color: "#111",
        },
        headerRight: () => (
          <Pressable
            onPressOut={router.back}
            className="mr-3"
            hitSlop={12}
            style={({ pressed }) => ({
              opacity: pressed ? 0.6 : 1,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            })}
          >
            <View
              className="
                h-9 w-9
                rounded-full
                items-center
                justify-center
                bg-neutral-100
              "
            >
              <Ionicons
                name="close"
                size={18}
                color="#444"
                suppressHighlighting
              />
            </View>
          </Pressable>
        ),
      }}
    />
  );
};
