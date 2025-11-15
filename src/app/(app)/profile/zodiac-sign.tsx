import { PrivateProfile } from "@/api/my-profile/types";
import { useZodiacSigns } from "@/api/options";
import { RadioList } from "@/components/radio-list";
import { StackHeaderV4 } from "@/components/stack-header-v4";
import { useEdit } from "@/store/edit";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

export default function Page() {
  const { edits, setEdits } = useEdit();
  const { data } = useZodiacSigns();
  const [selected, setSelected] = useState(edits?.zodiac_sign || null);

  const handlePress = () => {
    if (selected) {
      setEdits({
        ...edits,
        zodiac_sign: selected,
      } as PrivateProfile);
    }
    router.back();
  };

  return (
    <View className="flex-1 bg-white p-5">
      <StackHeaderV4 title="Zodiac Sign" onPressBack={handlePress} />
      <RadioList
        options={data}
        onChange={setSelected}
        initialSelection={selected}
      />
    </View>
  );
}