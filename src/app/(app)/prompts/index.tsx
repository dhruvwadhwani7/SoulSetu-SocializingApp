import { usePrompts } from "@/api/options";
import { Prompt } from "@/api/options/types";
import { StackHeaderV2 } from "@/components/shared/stack-header-v2";
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
    <View className="flex-1 bg-[#FAFAFB]">
      <StackHeaderV2 title="Prompts" />

      {/* Title + Tip */}
      <View className="px-5 pt-4 pb-3">
        <Text className="text-[20px] font-poppins-semibold text-[#111]">
          Choose a Prompt
        </Text>
        <Text className="text-[13px] text-neutral-500 mt-1">
          Tap a question to select it
        </Text>
      </View>

      <FlatList
        data={prompts}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-24 gap-4"
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item)}
            activeOpacity={0.85}
            className="bg-white rounded-2xl px-5 py-5 border border-neutral-200"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.04,
              shadowRadius: 10,
              elevation: 2,
            }}
          >
            {/* Prompt label */}
            <Text className="text-[11px] text-neutral-400 tracking-widest mb-2">
              PROMPT
            </Text>

            {/* Question */}
            <Text className="text-[16px] font-poppins-medium text-[#111] leading-snug">
              {item.question}...
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
