import { useIsMutating } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Layout() {
  const isPending = useIsMutating({ mutationKey: ["updateProfile"] });

  return (
    <>
      {!!isPending && (
        <View className="bg-black/50 flex-1 absolute left-0 top-0 right-0 bottom-0 z-10 items-center justify-center">
          <ActivityIndicator size={"large"} color={"white"} />
        </View>
      )}
      <Stack></Stack>
    </>
  );
}