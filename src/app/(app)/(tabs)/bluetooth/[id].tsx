import { useLocalSearchParams, Stack, router } from "expo-router";
import { View, Alert, Text, Pressable } from "react-native";
import { transformPublicProfile } from "@/utils/profile";
import { ProfileView } from "@/components/profile-view";
import { Loader } from "@/components/loader";
import { Fab } from "@/components/fab";
import {
  useLikeProfile,
  useSkipProfile,
  useProfileById,
} from "@/api/profiles";
import { Ionicons } from "@expo/vector-icons";

export default function ScannedProfilePage() {
  const params = useLocalSearchParams();
  const profileId =
    typeof params.id === "string" ? params.id : undefined;

  const { data, isLoading } = useProfileById(profileId);
  const { mutate: like } = useLikeProfile();
  const { mutate: skip } = useSkipProfile();

  if (isLoading) return <Loader />;
  if (!data) return null;

  const profile = transformPublicProfile(data);


  const handleLike = (itemId: string, type: "answer" | "photo") => {
    like(
      {
        profile: profile.id,
        answer: type === "answer" ? itemId : undefined,
        photo: type === "photo" ? itemId : undefined,
      },
      {
        onSuccess: () => {
          Alert.alert(
            "Like Sent 💜",
            `Your like has been sent to ${profile.first_name}.`,
            [
              {
                text: "OK",
                onPress: () => router.replace("/(app)/(tabs)/profile"),
              },
            ]
          );
        },
        onError: () => {
          Alert.alert(
            "Error",
            "Something went wrong while sending the like."
          );
        },
      }
    );
  };

  
  const handleSkip = () => {
    Alert.alert(
      "Skip Profile?",
      `You don’t want to like ${profile.first_name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => router.replace("/(app)/(tabs)/profile"),
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Hide native header */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* ================= HEADER ================= */}
      <View className="pt-14 px-5 pb-3 flex-row items-center justify-between">
        {/* Back */}
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-white"
          style={{
            shadowColor: "#7454F6",
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <Ionicons name="chevron-back" size={22} color="#111" />
        </Pressable>

        {/* Title */}
        <Text className="text-[14px] font-poppins-semibold tracking-widest text-neutral-500">
          SCANNED PROFILE
        </Text>

        {/* Spacer */}
        <View className="w-10" />
      </View>

      {/* ================= QR BADGE ================= */}
      <View className="items-center mt-2 mb-1">
        <View className="px-4 py-1.5 rounded-full bg-[#F1EDFF]">
          <Text className="text-[11px] text-[#7454F6] tracking-wide font-poppins-medium">
            Viewed via QR
          </Text>
        </View>
      </View>

      {/* ================= PROFILE CONTENT ================= */}
      <View className="flex-1 px-5 pt-2">
        <ProfileView
          profile={profile}
          onLike={handleLike}
        />
      </View>

      {/* ================= SKIP FAB ================= */}
      <Fab
        iconName="close"
        onPress={handleSkip}
        className="bg-white shadow-sm active:h-[4.75rem] h-20 absolute bottom-5 left-5"
        iconClassName="text-black text-4xl"
        loaderClassName="text-black"
      />
    </View>
  );
}
