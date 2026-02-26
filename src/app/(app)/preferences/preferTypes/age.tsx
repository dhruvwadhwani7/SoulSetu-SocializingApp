import { useUpdateAgeRange } from "@/api/my-profile";
import { StackHeaderV4 } from "@/components/shared/stack-header-v4";
import { useEdit } from "@/store/edit";
import { Slider } from "@miblanchard/react-native-slider";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";

const Page = () => {
  const { edits } = useEdit();
  const [ageRange, setAgeRange] = useState([
    edits?.min_age || 18,
    edits?.max_age || 100,
  ]);

  const { mutate, reset } = useUpdateAgeRange();

  const handlePress = () => {
    mutate(
      { min_age: ageRange[0], max_age: ageRange[1] },
      {
        onSuccess: () => router.back(),
        onError: () => {
          Alert.alert("Error", "Something went wrong, please try again later.");
          reset();
          router.back();
        },
      },
    );
  };

  return (
    <View className="flex-1 bg-white px-5 pt-10">
      <StackHeaderV4 title="Age range" onPressBack={handlePress} />

      {/* Instruction Section */}
      <Text className="text-[15px] font-poppins-light text-neutral-600 mt-3">
        Choose the age range of people you're interested in.
      </Text>
      <Text className="text-[14px] font-poppins-medium text-neutral-800 mt-1">
        Adjust the slider below.
      </Text>

      {/* Display selected values */}
      <View className="mt-10 mb-6 flex-row justify-between px-1">
        <Text className="text-2xl font-poppins-semibold text-neutral-700">
          {ageRange[0]}
        </Text>
        <Text className="text-2xl font-poppins-semibold text-neutral-700">
          {ageRange[1]}
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
          minimumValue={18}
          maximumValue={100}
          step={1}
          value={ageRange}
          onValueChange={(value) => setAgeRange(value)}
          // Lower track
          minimumTrackTintColor="#444"
          maximumTrackTintColor="#D1D1D6"
          // Thumb Styling
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
          renderAboveThumbComponent={(_index, value) => (
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
                {value}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default Page;
