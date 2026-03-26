import { useSignOut } from "@/api/auth";
import { useMyProfile } from "@/api/my-profile";
import AccountCard from "@/components/settings/AccountCard";
import DangerZone from "@/components/settings/DangerZone";
import LegalSection from "@/components/settings/LegalSection";
import ConfirmModal from "@/components/shared/confirm-modal";
import { StackHeaderV2 } from "@/components/shared/stack-header-v2";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function Page() {
  const { data: profile } = useMyProfile();
  const { mutate: signOut } = useSignOut();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      <StackHeaderV2 title="Settings" />

      <View className="absolute -top-20 -right-20 w-72 h-72 bg-[#F1EDFF] opacity-40 blur-3xl" />

      <ScrollView
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {/* ACCOUNT */}
        <Text className="text-xs font-poppins-semibold text-neutral-400 tracking-widest mb-3">
          ACCOUNT
        </Text>

        <AccountCard profile={profile} />

        {/* LEGAL */}
        <Text className="text-[11px] font-poppins-semibold text-neutral-400 tracking-[2px] mb-4 mt-2">
          LEGAL & POLICIES
        </Text>

        <LegalSection />

        <Pressable
          onPress={() => setShowLogoutModal(true)}
          className="rounded-full px-6 py-4 mt-12 bg-[#FFF1F1]"
          style={{
            shadowColor: "#EF4444",
            shadowOpacity: 0.25,
            shadowRadius: 14,
            elevation: 6,
          }}
        >
          <Text className="text-[16px] font-poppins-semibold text-red-600">
            Log out
          </Text>

          <Text className="text-[12px] text-red-400 mt-0.5 tracking-wide">
            Sign out safely
          </Text>
        </Pressable>
        {/* DANGER */}
        <Text className="text-xs font-poppins-semibold text-red-400 tracking-widest mb-3 mt-12">
          DANGER ZONE
        </Text>

        <DangerZone onDelete={() => setShowDeleteModal(true)} />
      </ScrollView>

      {/* MODALS */}
      <ConfirmModal
        visible={showLogoutModal}
        title="Log out?"
        subtitle="You can sign back in anytime. Your matches and chats will stay safe."
        confirmText="Log out"
        cancelText="Stay"
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          signOut();
        }}
      />

      <ConfirmModal
        visible={showDeleteModal}
        title="Delete account?"
        subtitle="This will permanently remove your profile, matches, and conversations. This action cannot be undone."
        confirmText="Delete permanently"
        cancelText="Keep account"
        danger
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => setShowDeleteModal(false)}
      />
    </View>
  );
}
