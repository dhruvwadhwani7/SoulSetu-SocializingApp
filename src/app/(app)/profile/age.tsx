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
    if (selectedDate) setDate(selectedDate);

    if (Platform.OS === "android") setShow(false);
  };

  const handlePress = () => {
    if (date) {
      setEdits({
        ...edits,
        dob: date as any,
      } as PrivateProfile);
    }
    router.back();
  };

  return (
    <View className="flex-1 bg-white px-5 pt-6">
      <StackHeaderV4 title="Age" onPressBack={handlePress} />

      {/* --- iOS Style Heading --- */}
      <Text className="text-[15px] text-neutral-500 font-poppins-regular mt-4 mb-2">
        Select your date of birth
      </Text>

      {/* --- Age Display Card --- */}
      <View
        className="rounded-2xl bg-[#F7F7F8] py-4 px-4 items-center justify-center border border-neutral-200"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.04,
          shadowRadius: 4,
        }}
      >
        <Text
          className="text-[34px] font-poppins-semibold text-[#1A1A1A]"
          onPress={() => setShow(true)}
        >
          Age {age(date.toString())}
        </Text>

        <Text className="text-[13px] mt-1 text-[#7A7A7A] font-poppins-light">
          Select your Birthdate
        </Text>
      </View>

      {/* iOS Roller Menu */}
      {(show || Platform.OS === "ios") && (
        <View
          className="mt-6 bg-white rounded-3xl overflow-hidden border border-neutral-200"
          style={{
            paddingVertical: Platform.OS === "ios" ? 10 : 0,
            shadowColor: "#7454F6",
            shadowOpacity: 0.06,
            shadowRadius: 6,
          }}
        >
          <DateTimePicker
            value={new Date(date)}
            mode={"date"}
            is24Hour={true}
            onChange={onChange}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            maximumDate={subYears(new Date(), 18)}
            minimumDate={subYears(new Date(), 100)}
            themeVariant="light"
          />
        </View>
      )}
    </View>
  );
}
