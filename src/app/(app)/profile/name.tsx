import { PrivateProfile } from "@/api/my-profile/types";
import { StackHeaderV4 } from "@/components/stack-header-v4";
import { useEdit } from "@/store/edit";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import colors from "tailwindcss/colors";

export default function Page() {
  const { edits, setEdits } = useEdit();
  const [firstName, setFirstName] = useState(edits?.first_name || "");

  const handlePress = () => {
    if (firstName) {
      setEdits({
        ...edits,
        first_name: firstName,
      } as PrivateProfile);
    }
    router.back();
  };

  return (
    <View className="flex-1 bg-white px-5 pt-6">
      {/* Header */}
      <StackHeaderV4 title="Name" onPressBack={handlePress} />

      {/* Label */}
      <Text className="text-[15px] text-neutral-500 font-poppins-regular mt-6 mb-2">
        Your first name
      </Text>

      {/* iOS-style input box */}
      <View
        className="rounded-2xl bg-[#F7F7F8] h-16 px-4 justify-center border border-neutral-200"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.04,
          shadowRadius: 4,
        }}
      >
        <TextInput
          className="text-[28px] font-poppins-medium text-[#1A1A1A]"
          selectionColor={colors.black}
          cursorColor={colors.black}
          placeholder="Enter name"
          placeholderTextColor="#9b9b9b"
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>

      {/* Subtle helper text */}
      <Text className="text-neutral-400 font-poppins-light text-sm mt-3">
        This will appear on your profile.
      </Text>
    </View>
  );
}
