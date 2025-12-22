import { PrivateProfile } from "@/api/my-profile/types";
import { StackHeaderV4 } from "@/components/stack-header-v4";
import { useEdit } from "@/store/edit";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import range from "lodash/range";
import { useState } from "react";
import { View, Text } from "react-native";

export default function Page() {
  const { edits, setEdits } = useEdit();
  const [selectedHeight, setSelectedHeight] = useState(
    edits?.height_cm || undefined
  );

  const handlePress = () => {
    if (selectedHeight) {
      setEdits({ ...edits, height_cm: selectedHeight } as PrivateProfile);
    }
    router.back();
  };

  return (
    <View className="flex-1 bg-white px-6 pt-6">
      <StackHeaderV4 title="Height" onPressBack={handlePress} />

      {/* Section label */}
      <Text className="text-[13px] tracking-wide text-neutral-400 mt-8 mb-3">
        SELECT YOUR HEIGHT (cm)
      </Text>

      {/* Picker Card */}
      <View
        className="rounded-3xl bg-[#FAFAFB] border border-neutral-200 px-4 py-5"
        style={{ shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6 }}
      >
        {/* Value preview */}
        <Text className="text-center text-[28px] font-poppins-semibold text-neutral-900 mb-2">
          {selectedHeight ? `${selectedHeight} cm` : "—"}
        </Text>

        <Text className="text-center text-[12px] text-neutral-400 mb-4">
          Scroll to adjust
        </Text>

        {/* Picker */}
        <View className="rounded-2xl overflow-hidden bg-white border border-neutral-200">
          <Picker
            selectedValue={selectedHeight}
            onValueChange={(value) => setSelectedHeight(value)}
            style={{ height: 180 }}
            itemStyle={{
              fontSize: 20,
              fontFamily: "Poppins-Medium",
              color: "#1A1A1A",
            }}
          >
            {range(92, 214).map((height) => (
              <Picker.Item key={height} label={`${height} cm`} value={height} />
            ))}
          </Picker>
        </View>
      </View>     
    </View>
  );
}
