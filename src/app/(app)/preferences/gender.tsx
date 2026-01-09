import { useUpdateGenderPreferences } from "@/api/my-profile";
import { useGenders } from "@/api/options";
import { CheckboxList } from "@/components/checkbox-list";
import { StackHeaderV4 } from "@/components/stack-header-v4";
import { useEdit } from "@/store/edit";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, View, Text, FlatList } from "react-native";

export default function Page() {
  const { edits } = useEdit();
  const { data } = useGenders();

  const [selected, setSelected] = useState(edits?.gender_preferences || []);

  const { mutate, reset } = useUpdateGenderPreferences();

  const handlePress = () => {
    if (selected) {
      mutate(
        { genders: selected.map((i) => i.id) },
        {
          onSuccess: () => router.back(),
          onError: () => {
            Alert.alert("Error", "Something went wrong, please try again later.");
            reset();
            router.back();
          },
        }
      );
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StackHeaderV4 title="I'm interested in" onPressBack={handlePress} />

      {/* FIX: no nested lists → FlatList wrapper */}
      <FlatList
        data={[]} // header-only list
        keyExtractor={() => "header"}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        ListHeaderComponent={
          <View>
            {/* Instruction text */}
            <Text className="text-[15px] font-poppins-light text-neutral-700 mb-1">
              Choose the genders you are interested in.
            </Text>

            <Text className="text-[14px] font-poppins-medium text-[#7454F6] mb-1">
              You may select more than one.
            </Text>

            <Text className="text-[13px] font-poppins-light text-neutral-500 mb-4">
              Your preferences help improve your matches.
            </Text>

            {/* Glassmorphism card */}
            <View
              style={{
                paddingVertical: 12,
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
              <CheckboxList
                options={data.map((item) => ({
                  id: item.id,
                  name: item.plural_name || item.name,
                }))}
                onChange={setSelected}
                initialSelection={selected}
              />
            </View>

            <View style={{ height: 30 }} />
          </View>
        }
      />
    </View>
  );
}
