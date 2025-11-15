import { usePrompts } from "@/api/options";
import { Prompt } from "@/api/options/types";
import { StackHeaderV2 } from "@/components/stack-header-v2";
import { router, useLocalSearchParams } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function Page() {
  const { data: prompts } = usePrompts();
  const { itemId } = useLocalSearchParams();
  const handlePress = (item: Prompt) => {
    router.dismissTo({
      pathname: "/write-answer",
      params: {
        promptId: item.id,
        itemId,
      },
    });
  };
  return (
    <View className="flex-1 bg-white">
      <StackHeaderV2 title="Prompts" />
      <FlatList
        data={prompts}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              key={item.id}
              className="p-3 py-5"
              onPress={() => handlePress(item)}
            >
              <Text className="text-sm font-poppins-regular">
                {item.question}
              </Text>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View className="h-px bg-neutral-200" />}
        contentContainerClassName="pl-5 pb-20"
      />
    </View>
  );
}
