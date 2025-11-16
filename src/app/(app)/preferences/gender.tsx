import { useUpdateGenderPreferences } from "@/api/my-profile";
import { useGenders } from "@/api/options";
import { CheckboxList } from "@/components/checkbox-list";
import { StackHeaderV4 } from "@/components/stack-header-v4";
import { useEdit } from "@/store/edit";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";

export default function Page() {
  const { edits } = useEdit();
  const { data } = useGenders();
  const [selected, setSelected] = useState(edits?.gender_preferences || []);
  const { mutate, reset } = useUpdateGenderPreferences();

  const handlePress = () => {
    if (selected) {
      mutate(
        {
          genders: selected.map((i) => i.id),
        },
        {
          onSuccess: () => {
            router.back();
          },
          onError: () => {
            Alert.alert(
              "Error",
              "Something went wrong, please try again later."
            );
            reset();
            router.back();
          },
        }
      );
    }
  };

  return (
    <View className="flex-1 bg-white p-5">
      <StackHeaderV4 title="I'm interested in" onPressBack={handlePress} />
      <CheckboxList
        options={data.map((item) => ({
          id: item.id,
          name: item.plural_name || item.name,
        }))}
        onChange={setSelected}
        initialSelection={selected}
      />
    </View>
  );
}
