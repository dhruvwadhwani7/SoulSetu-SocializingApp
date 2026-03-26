import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function QuickActions() {
  return (
    <>
      {/* ===== QUICK ACTIONS ROW 1 ===== */}
      <View className="px-6 mt-6">
        <View className="flex-row gap-4">
          {/* Preferences */}
          <Link href="/preferences" asChild>
            <Pressable
              className="flex-1 rounded-2xl px-4 py-4 bg-white border border-neutral-200"
              style={{
                shadowColor: "#7454F6",
                shadowOpacity: 0.12,
                shadowRadius: 10,
                elevation: 3,
              }}
            >
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 rounded-full bg-[#F1EDFF] items-center justify-center">
                  <Ionicons name="options-outline" size={20} color="#5A3FE3" />
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
              className="flex-1 rounded-2xl px-4 py-4 bg-white border border-neutral-200"
              style={{
                shadowColor: "#7454F6",
                shadowOpacity: 0.12,
                shadowRadius: 10,
                elevation: 3,
              }}
            >
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 rounded-full bg-[#F1EDFF] items-center justify-center">
                  <Ionicons name="settings-outline" size={20} color="#5A3FE3" />
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

      {/* ===== QUICK ACTIONS ROW 2 ===== */}
      <View className="px-6 mt-6">
        <View className="flex-row gap-4">
          {/* View Profile */}
          <Link href="/(app)/profile/(tabs)/view" asChild>
            <Pressable
              className="flex-1 rounded-2xl px-4 py-4 bg-white border border-neutral-200"
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

          {/* Edit Profile */}
          <Link href="/(app)/profile/(tabs)" asChild>
            <Pressable
              className="flex-1 rounded-2xl px-4 py-4 bg-white border border-neutral-200"
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
                    Edit and change your profile
                  </Text>
                </View>
              </View>
            </Pressable>
          </Link>
        </View>
      </View>
    </>
  );
}