import { useSignOut } from "@/api/auth";
import { StackHeaderV2 } from "@/components/stack-header-v2";
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

        <View className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm shadow-black/5">
          <TouchableOpacity
            onPress={() => setShowLogoutModal(true)}
            className="flex-row items-center justify-between"
          >
            <Text className="text-[15px] font-poppins-medium text-[#111]">
              Log out
            </Text>
            <Text className="text-[13px] text-neutral-400">Sign out safely</Text>
          </TouchableOpacity>
        </View>

        {/* ===== LEGAL ===== */}
        <Text className="text-xs font-poppins-semibold text-neutral-400 tracking-widest mb-3 mt-10">
          LEGAL & POLICIES
        </Text>

        <View className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm shadow-black/5">
          <SettingsRow
            label="Privacy Policy"
            onPress={() => router.push("/settings/other/privacy")}
          />
          <SettingsRow
            label="Terms & Conditions"
            onPress={() => router.push("/settings/other/terms")}
          />
          <SettingsRow
            label="Community Guidelines"
            onPress={() => router.push("/settings/other/guidelines")}
            noBorder
          />
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
        <View className="flex-1 bg-black/40 justify-center items-center px-6">
          <View className="w-full bg-white rounded-3xl p-6">
            <Text className="text-xl font-poppins-semibold text-center mb-2">
              Log out?
            </Text>
            <Text className="text-center text-neutral-500 font-poppins-regular mb-6">
              You’ll need to sign in again to continue.
            </Text>

            <View className="flex-row gap-3">
              <Pressable
                className="flex-1 py-3 rounded-xl bg-neutral-100"
                onPress={() => setShowLogoutModal(false)}
              >
                <Text className="text-center font-poppins-medium text-neutral-700">
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                className="flex-1 py-3 rounded-xl bg-[#111]"
                onPress={() => {
                  setShowLogoutModal(false);
                  signOut();
                }}
              >
                <Text className="text-center font-poppins-medium text-white">
                  Log Out
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ===== DELETE MODAL ===== */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center px-6">
          <View className="w-full bg-white rounded-3xl p-6">
            <Text className="text-xl font-poppins-semibold text-center mb-2 text-red-600">
              Delete account?
            </Text>
            <Text className="text-center text-neutral-500 font-poppins-regular mb-6">
              This action is permanent and cannot be undone.
            </Text>

            <View className="flex-row gap-3">
              <Pressable
                className="flex-1 py-3 rounded-xl bg-neutral-100"
                onPress={() => setShowDeleteModal(false)}
              >
                <Text className="text-center font-poppins-medium text-neutral-700">
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                className="flex-1 py-3 rounded-xl bg-red-600"
                onPress={() => {
                  setShowDeleteModal(false);
                  // backend delete logic
                }}
              >
                <Text className="text-center font-poppins-medium text-white">
                  Delete
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
      className={`py-4 px-4 ${
        !noBorder ? "border-b border-neutral-200" : ""
      }`}
    >
      <Text className="text-[15px] text-[#111] font-poppins-regular">
        {label}
      </Text>
    </TouchableOpacity>
  );
}
