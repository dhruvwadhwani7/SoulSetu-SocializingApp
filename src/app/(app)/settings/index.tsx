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
    <View className="flex-1 bg-white">
      <StackHeaderV2 title="Settings" />

      <ScrollView
        className="flex-1 px-5 pt-3"
        showsVerticalScrollIndicator={false}
      >
        {/* ACCOUNT SECTION */}
        <Text className="text-sm font-poppins-medium text-neutral-500 mb-2 mt-4">
          Account
        </Text>

        {/* LOG OUT BUTTON */}
        <TouchableOpacity
          className="w-full py-4 bg-[#FFF0F0] border border-red-200 rounded-xl mb-3"
          onPress={() => setShowLogoutModal(true)}
        >
          <Text className="text-center text-[16px] font-poppins-medium text-red-600">
            Log Out
          </Text>
        </TouchableOpacity>

        {/* PRIVACY & TERMS SECTION */}
        <Text className="text-sm font-poppins-medium text-neutral-500 mb-3 mt-4">
          Legal & Policies
        </Text>

        <TouchableOpacity
          className="py-4 border-b border-neutral-200"
          onPress={() => router.push("/settings/other/privacy")}
        >
          <Text className="text-[15px] text-neutral-700 font-poppins-regular">
            Privacy Policy
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="py-4 border-b border-neutral-200"
          onPress={() => router.push("/settings/other/terms")}
        >
          <Text className="text-[15px] text-neutral-700 font-poppins-regular">
            Terms & Conditions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="py-4 border-b border-neutral-200"
          onPress={() => router.push("/settings/other/guidelines")}
        >
          <Text className="text-[15px] text-neutral-700 font-poppins-regular">
            Community Guidelines
          </Text>
        </TouchableOpacity>

        {/* DELETE ACCOUNT AT END */}
        <TouchableOpacity
          className="w-full py-4 bg-[#FFEAEA] border border-red-300 rounded-xl mt-8 mb-16"
          onPress={() => setShowDeleteModal(true)}
        >
          <Text className="text-center text-[16px] font-poppins-semibold text-red-700">
            Delete Account
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* LOGOUT CONFIRMATION MODAL */}
      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center px-6">
          <View className="w-full bg-white rounded-2xl p-6">
            <Text className="text-xl font-poppins-semibold text-center mb-3">
              Log Out?
            </Text>
            <Text className="text-center text-neutral-600 font-poppins-regular mb-6">
              You will need to log in again to access your account.
            </Text>

            <View className="flex-row justify-between gap-4">
              <Pressable
                className="flex-1 py-3 rounded-xl bg-neutral-100"
                onPress={() => setShowLogoutModal(false)}
              >
                <Text className="text-center font-poppins-medium text-neutral-700">
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                className="flex-1 py-3 rounded-xl bg-red-600"
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

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center px-6">
          <View className="w-full bg-white rounded-2xl p-6">
            <Text className="text-xl font-poppins-semibold text-center mb-3 text-red-700">
              Delete Account?
            </Text>
            <Text className="text-center text-neutral-600 font-poppins-regular mb-6">
              This action is permanent and cannot be undone.
            </Text>

            <View className="flex-row justify-between gap-4">
              <Pressable
                className="flex-1 py-3 rounded-xl bg-neutral-100"
                onPress={() => setShowDeleteModal(false)}
              >
                <Text className="text-center font-poppins-medium text-neutral-700">
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                className="flex-1 py-3 rounded-xl bg-red-700"
                onPress={() => {
                  setShowDeleteModal(false);
                  // TODO: backend delete logic
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
