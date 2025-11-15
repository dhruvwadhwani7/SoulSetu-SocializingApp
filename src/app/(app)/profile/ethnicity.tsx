import { PrivateProfile } from "@/api/my-profile/types";
import { useEthnicities } from "@/api/options";
import { CheckboxList } from "@/components/checkbox-list";
import { StackHeaderV4 } from "@/components/stack-header-v4";
import { useEdit } from "@/store/edit";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

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
    <View className="flex-1 bg-white p-5">
      <StackHeaderV4 title="Ethnicity" onPressBack={handlePress} />
      <CheckboxList
        options={data}
        onChange={setSelected}
        initialSelection={selected}
      />
    </View>
  );
}