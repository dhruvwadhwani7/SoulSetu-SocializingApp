import { PrivateProfile } from "@/api/my-profile/types";
import { StackHeaderV4 } from "@/components/shared/stack-header-v4";
import { useEdit } from "@/store/edit";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import range from "lodash/range";
import { useState } from "react";
import { Text, View } from "react-native";

export default function Page() {
  const { edits, setEdits } = useEdit();

  const [selectedHeight, setSelectedHeight] = useState(edits?.height_cm ?? 170);

  const handlePress = () => {
    setEdits({
      ...edits,

      height_cm: selectedHeight,
    } as PrivateProfile);

    router.back();
  };

  return (
    <View className="flex-1 bg-white px-6 pt-6">
      <StackHeaderV4 title="Height" onPressBack={handlePress} />

      <Text className="text-[13px] tracking-wide text-neutral-400 mt-6 mb-3">
        SELECT YOUR HEIGHT
      </Text>

      <View className="rounded-3xl bg-[#FAFAFB] border border-neutral-200 px-5 py-6">
        <Text className="text-center text-[28px] font-semibold text-neutral-900 mb-2">
          {selectedHeight} cm
        </Text>

        <Picker
          selectedValue={selectedHeight}
          onValueChange={setSelectedHeight}
          style={{ height: 180 }}
        >
          {range(92, 214).map((h) => (
            <Picker.Item key={h} label={`${h} cm`} value={h} />
          ))}
        </Picker>
      </View>
    </View>
  );
}
