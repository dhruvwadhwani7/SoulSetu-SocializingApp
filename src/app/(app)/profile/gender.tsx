import { PrivateProfile } from "@/api/my-profile/types";
import { useGenders } from "@/api/options";
import { RadioList } from "@/components/radio-list";
import { StackHeaderV4 } from "@/components/stack-header-v4";
import { useEdit } from "@/store/edit";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

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
    <View className="flex-1 bg-white p-5">
      <StackHeaderV4 title="Gender" onPressBack={handlePress} />
      <RadioList
        options={data.map((item) => ({ id: item.id, name: item.name }))}
        onChange={setSelected}
        initialSelection={selected}
      />
    </View>
  );
}