import { ProfileView } from "@/components/profile-view";
import { useEdit } from "@/store/edit";
import { transformPrivateProfile } from "@/utils/profile";
import { Text, View } from "react-native";

export default function Page() {
  const { edits } = useEdit();

  if (!edits) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text>Something went wrong.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 px-5">
      <ProfileView profile={transformPrivateProfile(edits)} myProfile/>
    </View>
  );
}