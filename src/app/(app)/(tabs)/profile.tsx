import { useMyProfile } from "@/api/my-profile";
import { Card } from "@/components/card";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link, router, Stack } from "expo-router";
import { Pressable, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { data: profile } = useMyProfile();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Soft minimal background accents */}
      <View className="absolute top-[-40] right-[-40] w-48 h-48 bg-[#F4EFFF] rounded-full opacity-30 blur-3xl" />
      <View className="absolute bottom-[-60] left-[-60] w-72 h-72 bg-[#F8FAFF] rounded-full opacity-30 blur-3xl" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="px-6 py-5 border-b border-neutral-200 bg-white">
          <View className="flex-row items-center justify-between">
            {/* SoulSetu Branding */}
            <View>
              <Text
                className="text-[22px] font-poppins-semibold text-[#111]"
                style={{ letterSpacing: 1 }}
              >
                SoulSetu
              </Text>
              <View className="mt-1 h-[2px] w-8 bg-[#D2CAF5] rounded-full" />
            </View>

            <View className="flex-row items-center gap-6">
              <Link href={"/preferences"} suppressHighlighting>
                <Ionicons name="options-outline" size={24} color="#6B6B6B" />
              </Link>
              <Link href={"/settings"} suppressHighlighting>
                <Ionicons name="settings-outline" size={24} color="#6B6B6B" />
              </Link>
            </View>
          </View>
        </View>

        {/* PROFILE IMAGE + NAME */}
        <View className="items-center mt-10 mb-4">
          {/* DARK PURPLE RING */}
          <Pressable
            onPress={() => router.push("/profile")}
            className="h-40 aspect-square rounded-full items-center justify-center"
            style={{
              padding: 4,
              backgroundColor: "#5A3FE3", // dark purple ring
              borderRadius: 9999,
            }}
          >
            <View
              className="h-full w-full rounded-full bg-white p-[2px]"
              style={{ borderRadius: 9999 }}
            >
              <Image
                source={profile?.avatar_url}
                className="flex-1 rounded-full bg-neutral-300"
              />
            </View>
          </Pressable>

          <Text className="text-2xl font-poppins-semibold mt-4 text-[#111]">
            {profile?.first_name}
          </Text>

          <Text className="text-neutral-500 mt-1 font-poppins-regular">
            Tap to edit your profile
          </Text>
        </View>

        {/* PROFILE DETAILS */}
        <View className="px-6 mt-2">
          <Text className="text-[15px] font-poppins-semibold text-[#333] mb-2">
            Profile Details
          </Text>

          <View className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <CompactRow
              icon="person-outline"
              label="Name"
              value={profile?.first_name}
            />
            <CompactRow
              icon="calendar-outline"
              label="Age"
              value={profile?.dob ? calculateAge(profile.dob) + " yrs" : null}
            />
            <CompactRow
              icon="male-female-outline"
              label="Gender"
              value={profile?.gender?.name}
            />
            <CompactRow
              icon="chatbubble-outline"
              label="Pronouns"
              value={profile?.pronouns?.map((p) => p.name).join(", ")}
            />
            <CompactRow
              icon="heart-outline"
              label="Sexuality"
              value={profile?.sexuality?.name}
            />
            <CompactRow
              icon="body-outline"
              label="Height"
              value={profile?.height_cm ? `${profile.height_cm} cm` : null}
            />
            <CompactRow
              icon="people-outline"
              label="Children"
              value={profile?.children?.name}
            />
            <CompactRow
              icon="sparkles-outline"
              label="Zodiac"
              value={profile?.zodiac_sign?.name}
            />
            <CompactRow
              icon="location-outline"
              label="Location"
              value={profile?.neighborhood}
            />
          </View>
        </View>

        {/* FEATURE CHIPS — purple glassmorphism */}
        <View className="relative mt-8 px-6">
          {/* Background floating glow */}
          <View className="absolute -top-10 right-4 w-48 h-48 bg-[#EDE4FF] rounded-full opacity-30 blur-3xl" />
          <View className="absolute bottom-0 left-0 w-40 h-40 bg-[#F7F1FF] rounded-full opacity-25 blur-2xl" />

          <View className="flex-row flex-wrap justify-center gap-4">
            {["Meaningful Matches", "New Friendships", "Real Connections"].map(
              (label, index) => (
                <View
                  key={index}
                  className="
          px-5 py-2.5 
          rounded-full 
          border border-white/50 
          bg-white/50 
          backdrop-blur-2xl
          shadow-lg
        "
                  style={{
                    shadowColor: "#5A3FE3",
                    shadowOpacity: 0.12,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                >
                  <Text className="text-[13px] font-poppins-semibold text-[#5A3FE3] tracking-wide">
                    {label}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>

        {/* SETTINGS / SUPPORT CARDS */}
        <View className="px-6 mt-8 mb-10 gap-3">
          <Card
            key={"help"}
            icon={<Ionicons name="help-outline" size={24} color="#4A4A4A" />}
            title="Help Center"
            subtitle="Support & FAQs"
          />

          <Card
            key={"tips"}
            icon={<Ionicons name="bulb-outline" size={24} color="#4A4A4A" />}
            title="SoulSetu Tips"
            subtitle="Improve your experience"
          />

          <Card
            key={"guide"}
            icon={<Ionicons name="heart-outline" size={24} color="#4A4A4A" />}
            title="Connection Guide"
            subtitle="Learn what matters"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* Compact iOS-style profile row */
function CompactRow({ icon, label, value }) {
  return (
    <View className="flex-row items-center py-3 px-4 border-b border-neutral-200">
      <Ionicons name={icon} size={18} color="#777" />
      <Text className="ml-3 text-[14px] font-poppins-regular text-[#333]">
        {label}:{" "}
        <Text className="font-poppins-medium">{value || "Not added"}</Text>
      </Text>
    </View>
  );
}

/* Helper: Calculates age */
function calculateAge(dateString) {
  const dob = new Date(dateString);
  const diff = Date.now() - dob.getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
}
