import { useUpdateEthnicityPreferences } from "@/api/my-profile";
import { Option, PrivateProfile } from "@/api/my-profile/types";
import { useEthnicities } from "@/api/options";
import { CheckboxList } from "@/components/checkbox-list";
import { StackHeaderV4 } from "@/components/stack-header-v4";
import { useEdit } from "@/store/edit";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";

const Page = () => {
  const { edits, setEdits } = useEdit();
  const { data } = useEthnicities();
  const [selected, setSelected] = useState<Option[]>(
    edits?.ethnicity_preferences || []
  );

  const { mutate, reset } = useUpdateEthnicityPreferences();

  const handlePress = () => {
    setEdits({ ...edits, ethnicity_preferences: selected } as PrivateProfile);
    mutate(
      { ethnicities: selected.map((i) => i.id) },
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
    <View className="bg-white flex-1 p-5">
      <StackHeaderV4 title="Ethnicity" onPressBack={handlePress} />
      <CheckboxList
        options={data}
        initialSelection={selected}
        onChange={setSelected}
      />
    </View>
  );
};
export default Page;
