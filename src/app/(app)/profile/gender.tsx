import { PrivateProfile } from "@/api/my-profile/types";
import { useGenders } from "@/api/options";
import { RadioList } from "@/components/radio-list";
import { StackHeaderV4 } from "@/components/stack-header-v4";
import { useEdit } from "@/store/edit";
import { router } from "expo-router";
import { useState } from "react";
import { View, Text, FlatList } from "react-native";

export default function Page() {
  const { edits, setEdits } = useEdit();
  const { data } = useGenders();
  const [selected, setSelected] = useState(edits?.gender || null);

  const handlePress = () => {
    if (selected) {
      setEdits({
        ...edits,
        gender: selected,
      } as PrivateProfile);
    }
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      <StackHeaderV4 title="Gender" onPressBack={handlePress} />

      {/* Prevent nested list errors */}
      <FlatList
        data={[]} // Everything rendered in header
        keyExtractor={() => "header"}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        ListHeaderComponent={
          <View>
            {/* Instruction Text */}
            <Text className="text-[15px] font-poppins-light text-neutral-700 mb-1">
              Select the gender that best represents you.
            </Text>

            <Text className="text-[14px] font-poppins-medium text-[#7454F6] mb-1">
              This helps personalize your profile and matches.
            </Text>

            <Text className="text-[13px] font-poppins-light text-neutral-500 mb-4">
              Choose one option from the list below.
            </Text>

            {/* Glassmorphism Container */}
            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 20,
                backgroundColor: "rgba(250,250,255,0.65)",
                borderWidth: 1,
                borderColor: "rgba(200,180,255,0.35)",
                shadowColor: "#7454F6",
                shadowOpacity: 0.06,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 3 },
              }}
            >
              <RadioList
                options={data.map((item) => ({
                  id: item.id,
                  name: item.name,
                }))}
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
