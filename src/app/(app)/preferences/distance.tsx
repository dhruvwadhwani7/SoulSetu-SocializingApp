import { useUpdateDistance } from "@/api/my-profile";
import { StackHeaderV4 } from "@/components/stack-header-v4";
import { useEdit } from "@/store/edit";
import { Slider } from "@miblanchard/react-native-slider";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";

const Page = () => {
  const { edits } = useEdit();
  const [distance, setDistance] = useState(edits?.max_distance_km || 160);

  const { mutate, reset } = useUpdateDistance();

  const handlePress = () => {
    mutate(
      { distance },
      {
        onSuccess: () => router.back(),
        onError: () => {
          Alert.alert("Error", "Something went wrong, please try again later.");
          reset();
          router.back();
        },
      }
    );
  };

  return (
    <View className="flex-1 bg-white px-5 pt-10">
      <StackHeaderV4 title="Maximum distance" onPressBack={handlePress} />

      {/* Instructions */}
      <Text className="text-[15px] font-poppins-light text-neutral-600 mt-3">
        Set how far away you're open to meeting people.
      </Text>

      <Text className="text-[14px] font-poppins-medium text-neutral-800 mt-1">
        Drag the slider to adjust your distance preference.
      </Text>

      {/* Selected Value */}
      <View className="mt-10 mb-6 flex-row justify-center">
        <Text className="text-3xl font-poppins-semibold text-neutral-700">
          {distance} km
        </Text>
      </View>

      {/* Slider Container */}
      <View
        style={{
          paddingVertical: 30,
          paddingHorizontal: 16,
          borderRadius: 20,
          backgroundColor: "#F7F8FA",
          borderWidth: 1,
          borderColor: "#E5E6EB",
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
        }}
      >
        <Slider
          minimumValue={1}
          maximumValue={160}
          step={1}
          value={distance}
          onValueChange={(value) => setDistance(value[0])}
          
          minimumTrackTintColor="#444"
          maximumTrackTintColor="#D1D1D6"

          thumbStyle={{
            height: 28,
            width: 28,
            borderRadius: 14,
            backgroundColor: "#FFF",
            borderWidth: 1,
            borderColor: "#D0D0D5",
            shadowColor: "#000",
            shadowOpacity: 0.12,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
          }}

          renderAboveThumbComponent={() => (
            <View
              style={{
                marginBottom: 10,
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 8,
                backgroundColor: "rgba(0,0,0,0.05)",
              }}
            >
              <Text className="text-[13px] text-neutral-700 font-poppins-medium">
                {distance} km
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default Page;
