import { PrivateProfile } from "@/api/my-profile/types";
import { StackHeaderV4 } from "@/components/shared/stack-header-v4";
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
      setEdits({ ...edits, first_name: firstName } as PrivateProfile);
    }
    router.back();
  };

  return (
    <View className="flex-1 bg-white px-6 pt-6">
      <StackHeaderV4 title="Name" onPressBack={handlePress} />

      {/* Section label */}
      <Text className="text-[13px] tracking-wide text-neutral-400 mt-8 mb-3">
        YOUR FIRST NAME
      </Text>

      {/* Input Card */}
      <View
        className="rounded-3xl bg-[#FAFAFB] px-5 py-5 border border-neutral-200"
        style={{ shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6 }}
      >
        <TextInput
          className="text-[32px] font-poppins-semibold text-neutral-900"
          placeholder="Enter your name"
          placeholderTextColor="#B5B5B5"
          selectionColor={colors.black}
          cursorColor={colors.black}
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
        />
      </View>

      {/* Helper text */}
      <Text className="text-[12px] text-neutral-400 mt-4 leading-relaxed">
        This is how your name will appear on your profile.
      </Text>
    </View>
  );
}
