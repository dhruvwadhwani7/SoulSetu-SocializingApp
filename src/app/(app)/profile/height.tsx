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
      setEdits({
        ...edits,
        height_cm: selectedHeight,
      } as PrivateProfile);
    }
    router.back();
  };

  return (
    <View className="flex-1 bg-white px-5 pt-6">
      <StackHeaderV4 title="Height" onPressBack={handlePress} />

      {/* Heading */}
      <Text className="text-[15px] text-neutral-500 font-poppins-regular mt-4 mb-2">
        Select your height
      </Text>

      {/* iOS style card */}
      <View
        className="rounded-2xl bg-[#F7F7F8] border border-neutral-200 mt-4"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.04,
          shadowRadius: 4,
          paddingVertical: 16,
        }}
      >
        {/* Title inside card */}
        <Text className="text-center text-[20px] font-poppins-semibold text-[#1A1A1A] mb-3">
          Height
        </Text>

        {/* Picker container */}
        <View
          className="rounded-xl bg-white border border-neutral-200 overflow-hidden"
          style={{
            marginHorizontal: 16,
            shadowColor: "#7454F6",
            shadowOpacity: 0.05,
            shadowRadius: 4,
          }}
        >
          <Picker
            selectedValue={selectedHeight}
            onValueChange={(itemValue) => setSelectedHeight(itemValue)}
            style={{
              height: 180,
            }}
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

      {/* Selected Value Display */}
      {selectedHeight && (
        <Text className="text-center mt-5 text-[22px] text-[#444] font-poppins-medium">
          {selectedHeight} cm
        </Text>
      )}
    </View>
  );
}
