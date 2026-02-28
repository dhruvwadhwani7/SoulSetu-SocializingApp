import { ProfileView } from "@/components/profileView/profile-view";
import { useEdit } from "@/store/edit";
import { transformPrivateProfile } from "@/utils/profile";
import { Text, View } from "react-native";

export default function Page() {
  const { edits } = useEdit();

  if (!edits) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-8">
        <View
          className="w-full rounded-2xl border border-red-200 bg-red-50/40 px-6 py-6"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 14,
            elevation: 3,
          }}
        >
          <Text className="text-[16px] font-poppins-semibold text-red-600 text-center">
            Something went wrong
          </Text>

          <Text className="text-[13px] text-neutral-600 text-center mt-1 leading-relaxed">
            We couldn’t load this section right now.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 px-5">
      <ProfileView profile={transformPrivateProfile(edits)} myProfile />
    </View>
  );
}
