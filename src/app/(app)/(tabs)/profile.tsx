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

      {/* Ambient background accents */}
      <View className="absolute -top-20 -right-20 w-64 h-64 bg-[#EFEAFF] rounded-full opacity-40 blur-3xl" />
      <View className="absolute bottom-[-80] left-[-80] w-80 h-80 bg-[#F8FAFF] rounded-full opacity-35 blur-3xl" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== HEADER ===== */}
        <View className="px-6 pt-6 pb-4 bg-white">
          <View className="flex-row items-center justify-between">
            <View>
              <Text
                className="text-[24px] font-poppins-semibold text-[#111]"
                style={{ letterSpacing: 2 }}
              >
                SoulSetu
              </Text>
              <Text className="text-[11px] text-neutral-400 tracking-widest mt-0.5">
                YOUR SPACE
              </Text>
            </View>

            <View className="flex-row items-center gap-4">
              <Link href="/preferences" suppressHighlighting>
                <View
                  className="
        h-10 w-10 
        rounded-full 
        items-center 
        justify-center 
        bg-white/60 
        border border-white/40
        backdrop-blur-xl
      "
                  style={{
                    shadowColor: "#7454F6",
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                    elevation: 3,
                  }}
                >
                  <Ionicons name="options-outline" size={18} color="#5A5A5A" />
                </View>
              </Link>

              <Link href="/settings" suppressHighlighting>
                <View
                  className="
        h-10 w-10 
        rounded-full 
        items-center 
        justify-center 
        bg-white/60 
        border border-white/40
        backdrop-blur-xl
      "
                  style={{
                    shadowColor: "#7454F6",
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                    elevation: 3,
                  }}
                >
                  <Ionicons name="settings-outline" size={18} color="#5A5A5A" />
                </View>
              </Link>
            </View>
          </View>
        </View>

        {/* ===== PROFILE IMAGE + NAME ===== */}
        <View className="items-center mt-12 mb-8">
          <Pressable
            onPress={() => router.push("/profile")}
            className="rounded-full"
            style={{
              padding: 6,
              backgroundColor: "#EEE9FF",
              borderRadius: 9999,
            }}
          >
            <View
              className="rounded-full bg-white"
              style={{
                padding: 3,
                shadowColor: "#7454F6",
                shadowOpacity: 0.25,
                shadowRadius: 18,
                elevation: 6,
              }}
            >
              <Image
                source={profile?.avatar_url}
                className="h-36 w-36 rounded-full bg-neutral-200"
              />
            </View>
          </Pressable>

          <Text className="text-[22px] font-poppins-semibold mt-5 text-[#111]">
            {profile?.first_name}
          </Text>

          <Text className="text-[13px] text-neutral-400 mt-1 tracking-wide">
            Tap on profile to view and edit 
          </Text>
        </View>

        {/* ===== PROFILE DETAILS ===== */}
        <View className="px-6">
          <Text className="text-[14px] font-poppins-semibold text-neutral-500 mb-3 tracking-wide">
            PERSONAL DETAILS
          </Text>

          <View className="bg-white rounded-2xl px-2 py-1 shadow-sm shadow-black/5">
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

        {/* ===== QUICK ACTIONS ===== */}
        <View className="px-6 mt-6">
          <View className="flex-row gap-4">
            {/* Preferences */}
            <Link href="/preferences" asChild>
              <Pressable
                className="
          flex-1
          rounded-2xl
          px-4 py-4
          bg-white
          border border-neutral-200
        "
                style={{
                  shadowColor: "#7454F6",
                  shadowOpacity: 0.12,
                  shadowRadius: 10,
                  elevation: 3,
                }}
              >
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 rounded-full bg-[#F1EDFF] items-center justify-center">
                    <Ionicons
                      name="options-outline"
                      size={20}
                      color="#5A3FE3"
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-[15px] font-poppins-semibold text-[#111]">
                      Preferences
                    </Text>
                    <Text className="text-[12px] text-neutral-500 mt-0.5">
                      Match filters & values
                    </Text>
                  </View>
                </View>
              </Pressable>
            </Link>

            {/* Settings */}
            <Link href="/settings" asChild>
              <Pressable
                className="
          flex-1
          rounded-2xl
          px-4 py-4
          bg-white
          border border-neutral-200
        "
                style={{
                  shadowColor: "#7454F6",
                  shadowOpacity: 0.12,
                  shadowRadius: 10,
                  elevation: 3,
                }}
              >
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 rounded-full bg-[#F1EDFF] items-center justify-center">
                    <Ionicons
                      name="settings-outline"
                      size={20}
                      color="#5A3FE3"
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-[15px] font-poppins-semibold text-[#111]">
                      Settings
                    </Text>
                    <Text className="text-[12px] text-neutral-500 mt-0.5">
                      Privacy & account
                    </Text>
                  </View>
                </View>
              </Pressable>
            </Link>
          </View>
        </View>

        {/* ===== VALUES / PHILOSOPHY ===== */}
        <View className="relative mt-10 px-6">
          <View className="absolute -top-10 right-4 w-52 h-52 bg-[#EDE4FF] rounded-full opacity-30 blur-3xl" />

          <View className="flex-row flex-wrap justify-center gap-4">
            {[
              "Intentional Connections",
              "Emotional Clarity",
              "Shared Values",
            ].map((label, index) => (
              <View
                key={index}
                className="
                  px-5 py-2.5
                  rounded-full
                  bg-white/60
                  backdrop-blur-2xl
                  border border-white/40
                "
                style={{
                  shadowColor: "#5A3FE3",
                  shadowOpacity: 0.12,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <Text className="text-[12px] font-poppins-medium text-[#5A3FE3] tracking-wide">
                  {label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ===== SUPPORT / INFO CARDS ===== */}
        <View className="px-6 mt-10 gap-3">
          <Card
            icon={<Ionicons name="help-outline" size={22} color="#4A4A4A" />}
            title="Help Center"
            subtitle="Support & FAQs"
          />

          <Card
            icon={<Ionicons name="bulb-outline" size={22} color="#4A4A4A" />}
            title="SoulSetu Tips"
            subtitle="Improve your experience"
          />

          <Card
            icon={<Ionicons name="heart-outline" size={22} color="#4A4A4A" />}
            title="Connection Guide"
            subtitle="Learn what truly matters"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ===== Compact Row Component ===== */
function CompactRow({ icon, label, value }) {
  return (
    <View className="flex-row items-center py-3 px-3">
      <Ionicons name={icon} size={17} color="#8A8A8A" />
      <Text className="ml-3 text-[14px] text-[#444]">
        {label}
        <Text className="text-neutral-400"> · </Text>
        <Text className="font-poppins-medium text-[#111]">
          {value || "Not added"}
        </Text>
      </Text>
    </View>
  );
}

/* ===== Helper: Age Calculator ===== */
function calculateAge(dateString) {
  const dob = new Date(dateString);
  const diff = Date.now() - dob.getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
}
