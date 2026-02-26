import { PrivateProfile } from "@/api/my-profile/types";
import { useFamilyPlans } from "@/api/options";
import { RadioList } from "@/components/shared/radio-list";
import { StackHeaderV4 } from "@/components/shared/stack-header-v4";
import { useEdit } from "@/store/edit";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

export default function Page() {
  const { edits, setEdits } = useEdit();
  const { data } = useFamilyPlans();
  const [selected, setSelected] = useState(edits?.family_plan || null);

  const handlePress = () => {
    if (selected) {
      setEdits({
        ...edits,
        family_plan: selected,
      } as PrivateProfile);
    }
    router.back();
  };

  return (
    <View className="flex-1 bg-white px-5 pt-6">
      <StackHeaderV4 title="Family Plans" onPressBack={handlePress} />

      {/* Instruction Texts */}
      <Text className="text-[15px] font-poppins-regular text-neutral-700 mt-2">
        Choose your stance on family plans.
      </Text>

      <Text className="text-[14px] font-poppins-medium text-[#7454F6] mt-1">
        Select the option that represents you.
      </Text>

      <Text className="text-[13px] font-poppins-light text-neutral-500 mb-5 mt-1">
        This helps us better tailor match suggestions.
      </Text>

      {/* Glass Card Style */}
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
        <View style={{ width: "100%" }}>
          <RadioList
            options={data}
            onChange={setSelected}
            initialSelection={selected}
          />
        </View>
      </View>
    </View>
  );
}
