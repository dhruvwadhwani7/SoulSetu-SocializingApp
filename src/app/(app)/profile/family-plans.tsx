import { PrivateProfile } from "@/api/my-profile/types";
import { useFamilyPlans } from "@/api/options";
import { RadioList } from "@/components/radio-list";
import { StackHeaderV4 } from "@/components/stack-header-v4";
import { useEdit } from "@/store/edit";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

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
    <View className="flex-1 bg-white p-5">
      <StackHeaderV4 title="Family Plans" onPressBack={handlePress} />
      <RadioList
        options={data}
        onChange={setSelected}
        initialSelection={selected}
      />
    </View>
  );
}