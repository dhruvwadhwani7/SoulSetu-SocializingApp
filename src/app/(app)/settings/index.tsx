import { useMyProfile } from "@/api/my-profile";
import { useSignOut } from "@/api/auth";
import { StackHeaderV2 } from "@/components/stack-header-v2";
import { Image } from "expo-image";
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";

const Page = () => {
  const { data: profile } = useMyProfile();
  const { mutate: signOut } = useSignOut();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      <StackHeaderV2 title="Settings" />

      {/* Ambient glow */}
      <View className="absolute -top-20 -right-20 w-72 h-72 bg-[#F1EDFF] opacity-40 blur-3xl" />

      <ScrollView
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {/* ===== ACCOUNT ===== */}
        <Text className="text-xs font-poppins-semibold text-neutral-400 tracking-widest mb-3">
          ACCOUNT
        </Text>

        <Pressable
          onPress={() => router.push("/(app)/profile/(tabs)")}
          className="mb-4"
          style={({ pressed }) => ({
            transform: [{ scale: pressed ? 0.98 : 1 }],
            opacity: pressed ? 0.92 : 1,
          })}
        >
          <View
            className="bg-white rounded-3xl border border-neutral-200 px-5 py-5 flex-row items-center justify-between"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 14,
              elevation: 3,
            }}
          >
            {/* LEFT — User Info */}
            <View className="flex-1 pr-4">
              <Text className="text-[17px] font-poppins-semibold text-neutral-900">
                {profile?.first_name}
              </Text>

              <Text className="text-[14px] text-neutral-600 mt-1">
                +{profile?.phone}
              </Text>

              <Text className="text-[12px] text-neutral-400 mt-1 tracking-wide">
                My Profile
              </Text>
            </View>

            {/* RIGHT — Avatar */}
            <View
              className="h-20 w-20 rounded-full bg-white p-[3px]"
              style={{
                borderColor: "#7454F6",
                borderWidth: 2,
                shadowColor: "#7454F6",
                shadowOpacity: 0.28,
                shadowRadius: 12,
                elevation: 6,
              }}
            >
              <View className="flex-1 rounded-full overflow-hidden bg-neutral-200">
                <Image
                  source={profile?.avatar_url}
                  className="flex-1"
                  contentFit="cover"
                />
              </View>
            </View>
          </View>
        </Pressable>

        {/* ===== LEGAL ===== */}
        <Text className="text-[11px] font-poppins-semibold text-neutral-400 tracking-[2px] mb-4 mt-5">
          LEGAL & POLICIES
        </Text>

        <View
          className="
    bg-white
    rounded-3xl
    border border-neutral-200/80
    overflow-hidden
  "
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 16,
            elevation: 3,
          }}
        >
          <SettingsRow
            label="Privacy Policy"
            onPress={() => router.push("/settings/other/privacy")}
          />

          <View className="h-px bg-neutral-200/60 mx-5" />

          <SettingsRow
            label="Terms & Conditions"
            onPress={() => router.push("/settings/other/terms")}
          />

          <View className="h-px bg-neutral-200/60 mx-5" />

          <SettingsRow
            label="Community Guidelines"
            onPress={() => router.push("/settings/other/guidelines")}
            noBorder
          />
        </View>

         <View
          className="rounded-full mt-20 px-6 py-4 bg-[#FFF1F1]"
          style={{
            shadowColor: "#EF4444",
            shadowOpacity: 0.25,
            shadowRadius: 14,
            elevation: 6,
          }}
        >
          <TouchableOpacity
            onPress={() => setShowLogoutModal(true)}
            className="flex-row items-center justify-between"
            activeOpacity={0.85}
          >
            <View>
              <Text className="text-[16px] font-poppins-semibold text-red-600">
                Log out
              </Text>
              <Text className="text-[12px] text-red-400 mt-0.5 tracking-wide">
                Sign out safely
              </Text>
            </View>

            {/* subtle dot indicator */}
            <View className="h-3 w-3 rounded-full bg-red-400/60" />
          </TouchableOpacity>
        </View>

        {/* ===== DANGER ZONE ===== */}
        <Text className="text-xs font-poppins-semibold text-red-400 tracking-widest mb-3 mt-12">
          DANGER ZONE
        </Text>

        <TouchableOpacity
          onPress={() => setShowDeleteModal(true)}
          className="
            w-full 
            py-4 
            rounded-2xl 
            bg-white 
            border border-red-200
            mb-20
          "
        >
          <Text className="text-center text-[15px] font-poppins-semibold text-red-600">
            Delete Account Permanently
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ===== LOGOUT MODAL ===== */}
      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View className="flex-1 bg-black/40 items-center justify-center px-6">
          <View
            className="w-full bg-white rounded-[32px] px-6 py-7"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.12,
              shadowRadius: 30,
              elevation: 10,
            }}
          >
            {/* Title */}
            <Text className="text-[22px] font-poppins-semibold text-center text-[#111]">
              Log out?
            </Text>

            {/* Subtitle */}
            <Text className="text-center text-[14px] text-neutral-500 mt-2 leading-relaxed">
              You can sign back in anytime. Your matches and chats will stay
              safe.
            </Text>

            {/* Divider */}
            <View className="h-px bg-neutral-200/70 my-6" />

            {/* Actions */}
            <View className="flex-row gap-4">
              {/* Cancel */}
              <Pressable
                className="flex-1 h-12 rounded-full bg-neutral-100 items-center justify-center"
                onPress={() => setShowLogoutModal(false)}
              >
                <Text className="font-poppins-medium text-neutral-700">
                  Stay
                </Text>
              </Pressable>

              {/* Logout */}
              <Pressable
                className="flex-1 h-12 rounded-full bg-[#FFF1F1] items-center justify-center"
                onPress={() => {
                  setShowLogoutModal(false);
                  signOut();
                }}
                style={{
                  shadowColor: "#EF4444",
                  shadowOpacity: 0.25,
                  shadowRadius: 10,
                  elevation: 6,
                }}
              >
                <Text className="font-poppins-semibold text-red-600">
                  Log out
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ===== DELETE MODAL ===== */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View className="flex-1 bg-black/45 items-center justify-center px-6">
          <View
            className="w-full bg-white rounded-[32px] px-6 py-7"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 32,
              elevation: 12,
            }}
          >
            {/* Title */}
            <Text className="text-[22px] font-poppins-semibold text-center text-[#B91C1C]">
              Delete account?
            </Text>

            {/* Subtitle */}
            <Text className="text-center text-[14px] text-neutral-500 mt-2 leading-relaxed">
              This will permanently remove your profile, matches, and
              conversations.
              <Text className="font-poppins-medium text-neutral-600">
                {" "}
                This action cannot be undone.
              </Text>
            </Text>

            {/* Warning Box */}
            <View className="mt-5 rounded-2xl bg-[#FFF5F5] px-4 py-3 border border-red-200">
              <Text className="text-[13px] text-red-600 leading-relaxed">
                You will lose access to all connections and data associated with
                this account.
              </Text>
            </View>

            {/* Divider */}
            <View className="h-px bg-neutral-200/70 my-6" />

            {/* Actions */}
            <View className="flex-row gap-4">
              {/* Cancel */}
              <Pressable
                className="flex-1 h-12 rounded-full bg-neutral-100 items-center justify-center"
                onPress={() => setShowDeleteModal(false)}
              >
                <Text className="font-poppins-medium text-neutral-700">
                  Keep account
                </Text>
              </Pressable>

              {/* Delete */}
              <Pressable
                className="flex-1 h-12 rounded-full bg-[#FEE2E2] items-center justify-center"
                onPress={() => {
                  setShowDeleteModal(false);
                  // backend delete logic
                }}
                style={{
                  shadowColor: "#DC2626",
                  shadowOpacity: 0.25,
                  shadowRadius: 10,
                  elevation: 6,
                }}
              >
                <Text className="font-poppins-semibold text-red-700">
                  Delete permanently
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Page;

/* ===== Row Component ===== */
function SettingsRow({ label, onPress, noBorder }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`py-4 px-4 ${!noBorder ? "border-b border-neutral-200" : ""}`}
    >
      <Text className="text-[15px] text-[#111] font-poppins-regular">
        {label}
      </Text>
    </TouchableOpacity>
  );
}
