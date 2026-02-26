import { useMemo } from "react";
import { useMyProfile } from "@/api/my-profile";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link, router, Stack } from "expo-router";
import { Pressable, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* ================= PAGE ================= */

export default function Page() {
  const { data: profile } = useMyProfile();

  /** ✅ Stable random background image */
  const heroBackground = useMemo(() => {
    if (!profile?.photos?.length) return null;
    const index = Math.floor(Math.random() * profile.photos.length);
    return profile.photos[index]?.photo_url;
  }, [profile?.photos]);

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
                <HeaderIcon icon="options-outline" />
              </Link>

              <Link href="/settings" suppressHighlighting>
                <HeaderIcon icon="settings-outline" />
              </Link>
            </View>
          </View>
        </View>

        {/* ===== HERO PROFILE (FULLY PRESSABLE) ===== */}
        <Pressable onPress={() => router.push("/profile")} className="relative">
          {heroBackground && (
            <Image
              source={heroBackground}
              className="absolute inset-0 w-full h-full"
              contentFit="cover"
              blurRadius={40}
            />
          )}

          {/* Overlays */}
          <View className="absolute inset-0 bg-black/35" />
          <View className="absolute inset-0 bg-[#7454F6]/10" />

          {/* Content */}
          <View className="items-center pt-14 pb-8">
            {/* Avatar */}
            <View
              style={{
                padding: 4,
                borderRadius: 9999,
                borderWidth: 2,
                borderColor: "#7454F6",
                shadowColor: "#7454F6",
                shadowOpacity: 0.25,
                shadowRadius: 24,
                elevation: 8,
              }}
            >
              <View
                style={{
                  padding: 3,
                  borderRadius: 9999,
                  backgroundColor: "#fff",
                }}
              >
                <Image
                  source={profile?.avatar_url}
                  className="h-36 w-36 rounded-full bg-neutral-200"
                  contentFit="cover"
                />
              </View>
            </View>

            <Text className="text-[22px] font-poppins-semibold mt-5 text-white">
              {profile?.first_name}
            </Text>

            <Text className="text-[12px] text-white/80 tracking-wide mt-0.5">
              Tap profile to view & edit details
            </Text>

            {profile?.phone && (
              <View className="mt-3 px-4 py-1.5 rounded-full bg-white/90">
                <Text className="text-[15px] text-neutral-800 font-poppins-medium tracking-wide">
                  +{profile.phone}
                </Text>
              </View>
            )}
          </View>
        </Pressable>

        {/* QR ACTIONS */}

        <View className="flex-row justify-center gap-10 mt-6 mb-6">
          {/* Scan QR */}
          <Pressable
            onPress={() => router.push("/(app)/qr/scanqr")}
            className="items-center"
          >
            <View
              className="w-16 h-16 rounded-full bg-white items-center justify-center"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Ionicons name="scan-outline" size={26} color="#7454F6" />
            </View>
            <Text className="mt-2 text-sm text-neutral-700 font-poppins-medium">
              Scan QR
            </Text>
          </Pressable>

          {/* My QR */}
          <Pressable
            onPress={() => router.push("/(app)/qr/myqr")}
            className="items-center"
          >
            <View
              className="w-16 h-16 rounded-full bg-white items-center justify-center"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Ionicons name="qr-code-outline" size={26} color="#7454F6" />
            </View>
            <Text className="mt-2 text-sm text-neutral-700 font-poppins-medium">
              My QR
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(app)/places")}
            className="items-center"
          >
            <View className="w-16 h-16 rounded-full bg-white items-center justify-center shadow"
            style={{
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 4,
              }}>
              <Ionicons name="location-outline" size={26} color="#7454F6" />
            </View>
            <Text className="mt-2 text-sm text-neutral-700 font-poppins-medium">
              Places
            </Text>
          </Pressable>
        </View>

        {/* ===== PROFILE DETAILS ===== */}
        <View
          className="bg-white/80 rounded-3xl px-3 py-2 backdrop-blur-xl"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 20,
            elevation: 4,
          }}
        >
          {[
            {
              icon: "person-outline",
              label: "Name",
              value: profile?.first_name,
            },
            {
              icon: "calendar-outline",
              label: "Age",
              value: profile?.dob ? `${calculateAge(profile.dob)} yrs` : null,
            },
            {
              icon: "male-female-outline",
              label: "Gender",
              value: profile?.gender?.name,
            },
            {
              icon: "chatbubble-outline",
              label: "Pronouns",
              value: profile?.pronouns?.map((p) => p.name).join(", "),
            },
            {
              icon: "heart-outline",
              label: "Sexuality",
              value: profile?.sexuality?.name,
            },
            {
              icon: "body-outline",
              label: "Height",
              value: profile?.height_cm ? `${profile.height_cm} cm` : null,
            },
            {
              icon: "happy-outline",
              label: "Children",
              value: profile?.children?.name,
            },
            {
              icon: "sparkles-outline",
              label: "Zodiac",
              value: profile?.zodiac_sign?.name,
            },
            {
              icon: "location-outline",
              label: "Location",
              value: profile?.neighborhood,
            },
          ].map((item, index, array) => (
            <View key={item.label}>
              <CompactRow {...item} />
              {index !== array.length - 1 && (
                <View className="h-px bg-neutral-200/60 mx-3" />
              )}
            </View>
          ))}
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

        {/* ===== QUICK ACTIONS ===== */}
        <View className="px-6 mt-6">
          <View className="flex-row gap-4">
            {/* Preferences */}
            <Link href="/(app)/profile/(tabs)/view" asChild>
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
                    <Ionicons name="eye-outline" size={20} color="#5A3FE3" />
                  </View>

                  <View className="flex-1">
                    <Text className="text-[15px] font-poppins-semibold text-[#111]">
                      View Profile
                    </Text>
                    <Text className="text-[12px] text-neutral-500 mt-0.5">
                      See Your Profile
                    </Text>
                  </View>
                </View>
              </Pressable>
            </Link>

            {/* Edit profile */}
            <Link href="/(app)/profile/(tabs)" asChild>
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
                    <Ionicons name="build-outline" size={20} color="#5A3FE3" />
                  </View>

                  <View className="flex-1">
                    <Text className="text-[15px] font-poppins-semibold text-[#111]">
                      Edit Profile
                    </Text>
                    <Text className="text-[12px] text-neutral-500 mt-0.5">
                      Edit and chnage your profile
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
            {["Intentional Connections", "Emotional", "Shared Values"].map(
              (label, index) => (
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
              ),
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= COMPONENTS ================= */

const HeaderIcon = ({ icon }: { icon: keyof typeof Ionicons.glyphMap }) => (
  <View
    className="h-10 w-10 rounded-full items-center justify-center bg-white/60 border border-white/40"
    style={{
      shadowColor: "#7454F6",
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 3,
    }}
  >
    <Ionicons name={icon} size={18} color="#5A5A5A" />
  </View>
);

type CompactRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string | null;
};

const CompactRow = ({ icon, label, value }: CompactRowProps) => {
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
};

/* ================= UTILS ================= */

function calculateAge(date: string | Date) {
  const dob = new Date(date);
  const diff = Date.now() - dob.getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
}
