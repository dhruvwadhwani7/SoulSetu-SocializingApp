import { View, Text, Pressable, ActivityIndicator } from "react-native";

import { router } from "expo-router";
import { useEdit } from "@/store/edit";
import { useUpdateProfile } from "@/api/my-profile";
import { StepHeader, StepLayout } from "@/components/onboarding";
import { ProfileView } from "@/components/profileView/profile-view";
import { transformPrivateProfile } from "@/utils/profile";

export default function Page() {
  const { edits } = useEdit();

  const { mutate, isPending } = useUpdateProfile();

  const handleFinish = () => {
    if (!edits) return;

    mutate(
      edits,

      {
        onSuccess: () => {
          router.replace("/(app)/(tabs)");
        },
      },
    );
  };

  return (
    <StepLayout
      header={
        <StepHeader
          stepName="profile-preview"
          title="Preview Profile"
          subtitle="Make sure everything looks good"
        />
      }
      footer={
        <View className="px-6 pb-10 pt-6">
          <Pressable
            disabled={isPending}
            onPress={handleFinish}
            className="h-[54px] bg-[#7454F6] rounded-xl items-center justify-center"
          >
            {isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold">Finish</Text>
            )}
          </Pressable>
        </View>
      }
    >
      <View className="flex-1">
        {edits ? (
          <ProfileView profile={transformPrivateProfile(edits)} myProfile />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text>Something went wrong</Text>
          </View>
        )}
      </View>
    </StepLayout>
  );
}
