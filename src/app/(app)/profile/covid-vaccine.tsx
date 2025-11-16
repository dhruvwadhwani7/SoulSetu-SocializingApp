import { PrivateProfile } from "@/api/my-profile/types";
import { useCovidVaccine } from "@/api/options";
import { RadioList } from "@/components/radio-list";
import { StackHeaderV4 } from "@/components/stack-header-v4";
import { useEdit } from "@/store/edit";
import { router } from "expo-router";
import { useState } from "react";
import { View, Text } from "react-native";

export default function Page() {
  const { edits, setEdits } = useEdit();
  const { data } = useCovidVaccine();
  const [selected, setSelected] = useState(edits?.covid_vaccine || null);

  const handlePress = () => {
    if (selected) {
      setEdits({
        ...edits,
        covid_vaccine: selected,
      } as PrivateProfile);
    }
    router.back();
  };

  return (
    <View className="flex-1 bg-white px-5 pt-6">
      <StackHeaderV4 title="Covid Vaccine" onPressBack={handlePress} />

      {/* Instruction Texts */}
      <Text className="text-[15px] font-poppins-regular text-neutral-700 mt-2">
        Select your Covid-19 vaccination status.
      </Text>

      <Text className="text-[14px] font-poppins-medium text-[#7454F6] mt-1">
        This will be shown on your profile.
      </Text>

      <Text className="text-[13px] font-poppins-light text-neutral-500 mb-5 mt-1">
        Helps improve compatibility and safety insights.
      </Text>

      {/* Glass Card Wrapper */}
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
