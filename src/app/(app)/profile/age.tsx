import { PrivateProfile } from "@/api/my-profile/types";
import { StackHeaderV4 } from "@/components/stack-header-v4";
import { useEdit } from "@/store/edit";
import { age } from "@/utils/age";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { subYears } from "date-fns";
import { router } from "expo-router";
import { useState } from "react";
import { Platform, Text, View, Pressable } from "react-native";

export default function Page() {
  const { edits, setEdits } = useEdit();
  const [date, setDate] = useState(edits?.dob || subYears(new Date(), 18));
  const [show, setShow] = useState(false);

  const onChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) setDate(selectedDate);
    if (Platform.OS === "android") setShow(false);
  };

  const handlePress = () => {
    setEdits({ ...edits, dob: date as any } as PrivateProfile);
    router.back();
  };

  return (
    <View className="flex-1 bg-white px-6 pt-6">
      <StackHeaderV4 title="Age" onPressBack={handlePress} />

      {/* Label */}
      <Text className="text-[13px] tracking-wide text-neutral-400 mt-6">
        YOUR AGE
      </Text>

      {/* Age Display */}
      <Pressable
        onPress={() => setShow(true)}
        className="mt-3 rounded-3xl bg-[#FAFAFB] border border-neutral-200 px-6 py-8 items-center"
        style={{ shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6 }}
      >
        <Text className="text-[44px] font-poppins-semibold text-neutral-900">
          {age(date.toString())}
        </Text>
        <Text className="text-[13px] text-neutral-500 mt-1">
          years old
        </Text>
      </Pressable>

      {/* Helper text */}
      <Text className="text-[12px] text-neutral-400 text-center mt-4">
        Tap to change your birthdate
      </Text>

      {/* Date Picker */}
      {(show || Platform.OS === "ios") && (
        <View
          className="mt-8 rounded-3xl bg-white border border-neutral-200 overflow-hidden"
          style={{ shadowColor: "#7454F6", shadowOpacity: 0.05, shadowRadius: 8 }}
        >
          <DateTimePicker
            value={new Date(date)}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChange}
            maximumDate={subYears(new Date(), 18)}
            minimumDate={subYears(new Date(), 100)}
            themeVariant="light"
          />
        </View>
      )}
    </View>
  );
}
