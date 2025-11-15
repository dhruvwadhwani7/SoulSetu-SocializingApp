import { PrivateProfile } from "@/api/my-profile/types";
import { StackHeaderV4 } from "@/components/stack-header-v4";
import { useEdit } from "@/store/edit";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import range from "lodash/range";       // FIXED import
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
    <View className="flex-1 bg-white p-5">
      <StackHeaderV4 title="Height" onPressBack={handlePress} />

      {/* Beautiful center card UI */}
      <View
        style={{
          marginTop: 40,
          backgroundColor: "#f9fafb",
          padding: 20,
          borderRadius: 14,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            fontWeight: "600",
            marginBottom: 12,
            color: "#333",
          }}
        >
          Select Your Height
        </Text>

        <View
          style={{
            borderRadius: 12,
            overflow: "hidden",
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#e5e7eb",
          }}
        >
          <Picker
            selectedValue={selectedHeight}
            onValueChange={(itemValue) => setSelectedHeight(itemValue)}
            style={{
              height: 160,
            }}
            itemStyle={{
              fontSize: 20,
              color: "#111",
            }}
          >
            {range(92, 214).map((height) => (
              <Picker.Item key={height} label={`${height} cm`} value={height} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Display selected value nicely */}
      {selectedHeight && (
        <Text
          style={{
            textAlign: "center",
            marginTop: 25,
            fontSize: 22,
            color: "#444",
            fontWeight: "500",
          }}
        >
          Selected: {selectedHeight} cm
        </Text>
      )}
    </View>
  );
}
