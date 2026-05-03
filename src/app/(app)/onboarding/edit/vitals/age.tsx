import { PrivateProfile } from "@/api/my-profile/types";
import { StackHeaderV4 } from "@/components/shared/stack-header-v4";
import { useEdit } from "@/store/edit";
import { age } from "@/utils/profile/age";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { subYears } from "date-fns";
import { router } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

export default function Page() {
  const { edits, setEdits } = useEdit();

  const [date, setDate] = useState<Date>(
    edits?.dob ? new Date(edits.dob) : subYears(new Date(), 18),
  );

  const [show, setShow] = useState(false);

  const onChange = (
    event: DateTimePickerEvent,

    selectedDate?: Date,
  ) => {
    if (selectedDate) {
      setDate(selectedDate);
    }

    if (Platform.OS === "android") {
      setShow(false);
    }
  };

  const handlePress = () => {
    setEdits({
      ...edits,

      dob: date.toISOString(),
    } as PrivateProfile);

    router.back();
  };

  return (
    <View className="flex-1 bg-white px-6 pt-6">
      <StackHeaderV4 title="Age" onPressBack={handlePress} />

      <Text className="text-[13px] tracking-wide text-neutral-400 mt-6">
        YOUR AGE
      </Text>

      <Pressable
        onPress={() => setShow(true)}
        className="mt-3 rounded-3xl bg-[#FAFAFB] border border-neutral-200 px-6 py-8 items-center"
      >
        <Text className="text-[44px] font-semibold text-neutral-900">
          {age(date.toISOString())}
        </Text>

        <Text className="text-[13px] text-neutral-500 mt-1">years old</Text>
      </Pressable>

      {(show || Platform.OS === "ios") && (
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={onChange}
          maximumDate={subYears(new Date(), 18)}
        />
      )}
    </View>
  );
}
