import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useMyProfile } from "@/api/my-profile";
import Header from "@/components/profilePage/Header";
import HeroProfile from "@/components/profilePage/HeroProfile";
import ProfileDetails from "@/components/profilePage/ProfileDetails";
import ValueTags from "@/components/profilePage/ValueTags";
import QuickActions from "@/components/profilePage/QuickActions";
import { QR_ACTIONS } from "@/constants/profilePage";
import ActionButton from "@/components/profilePage/ActionButton";

export default function ProfilePage() {
  const { data: profile } = useMyProfile();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="absolute -top-20 -right-20 w-64 h-64 bg-[#EFEAFF] rounded-full opacity-40 blur-3xl" />
      <View className="absolute bottom-[-80] left-[-80] w-80 h-80 bg-[#F8FAFF] rounded-full opacity-35 blur-3xl" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        <HeroProfile profile={profile} />

        <View className="flex-row justify-center gap-10 mt-6 mb-6">
          {QR_ACTIONS.map((a) => (
            <ActionButton key={a.label} {...a} />
          ))}
        </View>

        <ProfileDetails profile={profile} />

        <QuickActions />

        <ValueTags />
      </ScrollView>
    </SafeAreaView>
  );
}
