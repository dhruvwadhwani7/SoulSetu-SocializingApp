import { PrivateProfile } from "@/api/my-profile/types";
import { useEthnicities } from "@/api/options";
import { CheckboxList } from "@/components/checkbox-list";
import { StackHeaderV4 } from "@/components/stack-header-v4";
import { useEdit } from "@/store/edit";
import { router } from "expo-router";
import { useState } from "react";
import { View, Text } from "react-native";

export default function Page() {
  const { edits, setEdits } = useEdit();
  const { data } = useEthnicities();
  const [selected, setSelected] = useState(edits?.ethnicities || []);

  const handlePress = () => {
    if (selected) {
      setEdits({
        ...edits,
        ethnicities: selected,
      } as PrivateProfile);
    }
    router.back();
  };

  return (
    <View className="flex-1 bg-white px-5 pt-6">
      <StackHeaderV4 title="Ethnicity" onPressBack={handlePress} />

      {/* Soft Instructions */}
      <View className="mb-5 mt-1">
        <Text className="text-[15px] font-poppins-regular text-neutral-700 mb-1">
          Select the ethnicities that represent you.
        </Text>

        <Text className="text-[14px] font-poppins-medium text-[#7454F6] mb-1">
          You may choose multiple options.
        </Text>

        <Text className="text-[13px] font-poppins-light text-neutral-500">
          This helps personalize your SoulSetu experience.
        </Text>
      </View>

      {/* iOS Styled Glass Card */}
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 14,
          borderRadius: 20,
          backgroundColor: "rgba(250,250,255,0.7)", // soft translucent
          borderWidth: 1,
          borderColor: "rgba(200,180,255,0.35)",
          shadowColor: "#7454F6",
          shadowOpacity: 0.07,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
        }}
      >
        <View style={{ width: "100%" }}>
          <CheckboxList
            options={data}
            onChange={setSelected}
            initialSelection={selected}
          />
        </View>
      </View>
    </View>
  );
}
