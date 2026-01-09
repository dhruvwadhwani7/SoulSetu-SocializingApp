import { useUpdateEthnicityPreferences } from "@/api/my-profile";
import { Option, PrivateProfile } from "@/api/my-profile/types";
import { useEthnicities } from "@/api/options";
import { CheckboxList } from "@/components/checkbox-list";
import { StackHeaderV4 } from "@/components/stack-header-v4";
import { useEdit } from "@/store/edit";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  View,
  Text,
  FlatList,
} from "react-native";

const Page = () => {
  const { edits, setEdits } = useEdit();
  const { data } = useEthnicities();

  const [selected, setSelected] = useState<Option[]>(
    edits?.ethnicity_preferences || []
  );

  const { mutate, reset } = useUpdateEthnicityPreferences();

  const handlePress = () => {
    setEdits({ ...edits, ethnicity_preferences: selected } as PrivateProfile);

    mutate(
      { ethnicities: selected.map((i) => i.id) },
      {
        onSuccess: () => router.back(),
        onError: () => {
          Alert.alert("Error", "Something went wrong, please try again later.");
          reset();
          router.back();
        },
      }
    );
  };

  return (
    <View className="flex-1 bg-white">
      <StackHeaderV4 title="Ethnicity" onPressBack={handlePress} />

      {/* FIXED: All scroll content inside FlatList → no nested list issues */}
      <FlatList
        data={[]} // empty data, we use only ListHeaderComponent
        keyExtractor={() => "header"}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        ListHeaderComponent={
          <View>
            {/* Instruction Text */}
            <Text className="text-[15px] font-poppins-light text-neutral-700 mb-1">
              Select the ethnicities that represent you.
            </Text>

            <Text className="text-[14px] font-poppins-medium text-[#7454F6] mb-1">
              You may choose more than one option.
            </Text>

            <Text className="text-[13px] font-poppins-light text-neutral-500 mb-4">
              These help personalize your recommendations.
            </Text>

            {/* Glassmorphism Styled Container */}
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
                options={data}
                initialSelection={selected}
                onChange={setSelected}
              />
            </View>

            <View style={{ height: 40 }} />
          </View>
        }
      />
    </View>
  );
};

export default Page;
