import { PrivateProfile } from "@/api/my-profile/types";
import { usePronouns } from "@/api/options";
import { CheckboxList } from "@/components/checkbox-list";
import { StackHeaderV4 } from "@/components/stack-header-v4";
import { useEdit } from "@/store/edit";
import { router } from "expo-router";
import { useState } from "react";
import { View, Text, FlatList } from "react-native";

export default function Page() {
  const { edits, setEdits } = useEdit();
  const { data } = usePronouns();
  const [selected, setSelected] = useState(edits?.pronouns || []);

  const handlePress = () => {
    if (selected) {
      setEdits({
        ...edits,
        pronouns: selected,
      } as PrivateProfile);
    }
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      <StackHeaderV4 title="Pronouns" onPressBack={handlePress} />

      {/* FlatList wrapper to avoid nested virtualized lists */}
      <FlatList
        data={[]} // UI rendered via ListHeaderComponent
        keyExtractor={() => "header"}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        ListHeaderComponent={
          <View>

            {/* Instructional Text */}
            <Text className="text-[15px] font-poppins-light text-neutral-700 mb-1">
              Choose the pronouns that represent you.
            </Text>

            <Text className="text-[14px] font-poppins-medium text-[#7454F6] mb-1">
              You may select more than one option.
            </Text>

            <Text className="text-[13px] font-poppins-light text-neutral-500 mb-4">
              Adding pronouns helps others understand how to address you.
            </Text>

            {/* Glassmorphic container */}
            <View
              style={{
                paddingVertical: 10,
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
              <CheckboxList
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
