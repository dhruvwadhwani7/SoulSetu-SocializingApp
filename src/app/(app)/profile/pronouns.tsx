import { PrivateProfile } from "@/api/my-profile/types";
import { usePronouns } from "@/api/options";
import { CheckboxList } from "@/components/checkbox-list";
import { StackHeaderV4 } from "@/components/stack-header-v4";
import { useEdit } from "@/store/edit";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

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
    <View className="flex-1 bg-white p-5">
      <StackHeaderV4 title="Pronouns" onPressBack={handlePress} />
      <CheckboxList
        options={data}
        onChange={setSelected}
        initialSelection={selected}
      />
    </View>
  );
}