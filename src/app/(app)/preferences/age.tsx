import { useUpdateAgeRange } from "@/api/my-profile";
import { StackHeaderV4 } from "@/components/stack-header-v4";
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
        onSuccess: () => {
          router.back();
        },
        onError: () => {
          Alert.alert("Error", "Something went wrong, please try again later.");
          reset();
          router.back();
        },
      }
    );
  };

  return (
    <View className="bg-white flex-1 px-5 py-20 ">
      <StackHeaderV4 title="Age range" onPressBack={handlePress} />
      <Slider
        minimumValue={18}
        maximumValue={100}
        step={1}
        value={ageRange}
        onValueChange={(value) => setAgeRange(value)}
        renderAboveThumbComponent={(_index, value) => {
          return (
            <View className="items-center justify-center w-16 -left-8">
              <Text className="text-center ">{value}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};
export default Page;
