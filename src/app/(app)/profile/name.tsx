import { PrivateProfile } from "@/api/my-profile/types";
import { StackHeaderV4 } from "@/components/stack-header-v4";
import { useEdit } from "@/store/edit";
import { router } from "expo-router";
import { useState } from "react";
import { TextInput, View } from "react-native";
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
    <View className="flex-1 bg-white p-5">
      <StackHeaderV4 title="Name" onPressBack={handlePress} />
      <TextInput
        className="border-b h-16 text-4xl font-poppins-medium"
        selectionColor={colors.black}
        cursorColor={colors.black}
        value={firstName}
        onChangeText={setFirstName}
      />
    </View>
  );
}