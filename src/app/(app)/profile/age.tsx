import { PrivateProfile } from "@/api/my-profile/types";
import { StackHeaderV4 } from "@/components/stack-header-v4";
import { useEdit } from "@/store/edit";
import { age } from "@/utils/age";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { subYears } from "date-fns";
import { router } from "expo-router";
import { useState } from "react";
import { Platform, Text, View } from "react-native";

export default function Page() {
  const { edits, setEdits } = useEdit();
  const [date, setDate] = useState(edits?.dob || subYears(new Date(), 18));
  const [show, setShow] = useState(false);

  const onChange = (
    _event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    if (selectedDate) {
      setDate(selectedDate);
    }

    if (Platform.OS === "android") {
      setShow(false);
    }
  };

  const handlePress = () => {
    if (date) {
      setEdits({
        ...edits,
        dob: date as string,
      } as PrivateProfile);
    }
    router.back();
  };

  return (
    <View className="flex-1 bg-white p-5">
      <StackHeaderV4 title="Age" onPressBack={handlePress} />
      {(show || Platform.OS === "ios") && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(date)}
          mode={"date"}
          is24Hour={true}
          onChange={onChange}
          display="spinner"
          maximumDate={subYears(new Date(), 18)}
          minimumDate={subYears(new Date(), 100)}
          themeVariant="light"
        />
      )}
      <Text
        className="text-4xl text-center font-poppins-medium mt-5"
        onPress={() => setShow(true)}
      >{`Age ${age(date.toString())}`}</Text>
    </View>
  );
}