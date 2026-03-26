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
    setEdits({
      ...edits,

      first_name: firstName.trim(),
    } as PrivateProfile);

    router.back();
  };

  return (
    <View className="flex-1 bg-white px-6 pt-6">
      <StackHeaderV4 title="Name" onPressBack={handlePress} />

      <Text className="text-[13px] tracking-wide text-neutral-400 mt-8 mb-3">
        YOUR FIRST NAME
      </Text>

      <View className="rounded-3xl bg-[#FAFAFB] px-5 py-5 border border-neutral-200">
        <TextInput
          className="text-[32px] font-semibold text-neutral-900"
          placeholder="Enter your name"
          placeholderTextColor="#B5B5B5"
          selectionColor={colors.black}
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
        />
      </View>
    </View>
  );
}
