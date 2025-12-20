import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { FC } from "react";


// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props {}

export const StackHeader: FC<Props> = () => {
  return (
    <Stack.Screen
        options={{
          headerBackVisible: false,
          title: "",
          headerRight: () => (
            <Ionicons 
              name="close" 
              className="text-4xl" 
              onPress={router.back} 
              suppressHighlighting  
            />
        ),
        headerShadowVisible:false

        }}
      />
  );
};
