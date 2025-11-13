import { Link, Stack } from "expo-router";
import { Pressable, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  return (
    <View className="flex-1 bg-[#ffffff]">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <StatusBar barStyle={"light-content"} />
      <SafeAreaView className="flex-1 p-10">
        <View className="flex-1 items-center pt-14 justify-center">
          <View className="h-4" />
          <Text
            numberOfLines={3}
            adjustsFontSizeToFit
            className="text-[#050505] text-3xl font-poppins-regular text-center leading-relaxed"
          >
            {"Find Your\n"}
            <Text className="font-poppins-semibold">Perfect</Text>
            {"\nMatch"}
          </Text>
        </View>
        <Link href={"/phone"} asChild>
          <Pressable className="bg-[#F2F1F1] h-16 mb-24 items-center justify-center rounded-[10] w-3/4 self-center">
            <Text className="text-[#050505] text-lg font-poppins-medium">
              Discover
            </Text>
          </Pressable>
        </Link>
      </SafeAreaView>
    </View>
  );
}
