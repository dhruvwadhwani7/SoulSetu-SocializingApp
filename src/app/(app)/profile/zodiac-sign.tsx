import { PrivateProfile } from "@/api/my-profile/types";
import { useZodiacSigns } from "@/api/options";
import { RadioList } from "@/components/radio-list";
import { StackHeaderV4 } from "@/components/stack-header-v4";
import { useEdit } from "@/store/edit";
import { router } from "expo-router";
import { useState } from "react";
import { View, Text, FlatList } from "react-native";

export default function Page() {
  const { edits, setEdits } = useEdit();
  const { data } = useZodiacSigns();
  const [selected, setSelected] = useState(edits?.zodiac_sign || null);

  const handlePress = () => {
    if (selected) {
      setEdits({
        ...edits,
        zodiac_sign: selected,
      } as PrivateProfile);
    }
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      <StackHeaderV4 title="Zodiac Sign" onPressBack={handlePress} />

      <FlatList
        data={[]}   // empty list → using ListHeaderComponent
        keyExtractor={() => "header"}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={{ padding: 20 }}>
            {/* Instruction text */}
            <Text className="text-[15px] font-poppins-light text-neutral-700 mb-1">
              Select the zodiac sign that represents you.
            </Text>

            <Text className="text-[14px] font-poppins-medium text-[#7454F6] mb-1">
              This helps personalize your matches.
            </Text>

            <Text className="text-[13px] font-poppins-light text-neutral-500 mb-4">
              Choose one option below.
            </Text>

            {/* Glass Card */}
            <View
              style={{
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderRadius: 20,
                backgroundColor: "rgba(250,250,255,0.7)",
                borderWidth: 1,
                borderColor: "rgba(200,180,255,0.35)",
                shadowColor: "#7454F6",
                shadowOpacity: 0.06,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 3 },
              }}
            >
              <RadioList
                options={data}
                onChange={setSelected}
                initialSelection={selected}
              />
            </View>

            <View style={{ height: 40 }} />
          </View>
        }
      />
    </View>
  );
}
