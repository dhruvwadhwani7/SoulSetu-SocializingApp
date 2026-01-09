import { List } from "@/components/list";
import { StackHeaderV2 } from "@/components/stack-header-v2";
import { useEdit } from "@/store/edit";
import { memberPreferences } from "@/utils/preferences";
import { Text, View } from "react-native";

export default function Page() {
  const { edits } = useEdit();
  if (!edits) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text>Something went wrong</Text>
      </View>
    );
  }
  return (
    <View className="flex-1 bg-white p-5">
      <StackHeaderV2 title="Dating Preferences" />
      <List
        title="Member Preferences"
        data={memberPreferences}
        profile={edits}
      />
    </View>
  );
}
