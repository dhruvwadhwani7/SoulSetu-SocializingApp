import { useLikes, useMatch, useRemoveLike } from "@/api/profiles";
import { Fab } from "@/components/fab";
import { ProfileView } from "@/components/profile-view";
import { transformPublicProfile } from "@/utils/profile";
import { Image } from "expo-image";
import { Redirect, Stack, router, useLocalSearchParams } from "expo-router";
import { Alert, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useState } from "react";

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mutate: remove, isPending: removePending } = useRemoveLike();
  const { mutate: match, isPending: matchPending } = useMatch();

  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [showMatchConfirm, setShowMatchConfirm] = useState(false);

  const { data } = useLikes();
  const like = data.find((like) => like.id === id);

  // 🔒 Guard: like not found
  if (!like) {
    return <Redirect href="/likes" />;
  }

  // 🔒 Guard: profile missing
  if (!like.profile) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-neutral-600">
          This profile is no longer available.
        </Text>
      </View>
    );
  }

  const profile = transformPublicProfile(like.profile);

  const handleRemove = () => {
    remove(like.id, {
      onSuccess: () => router.back(),
      onError: () =>
        Alert.alert("Error", "Something went wrong, please try again later"),
    });
  };

  const handleMatch = () => {
    match(like.id, {
      onSuccess: () => router.back(),
      onError: () =>
        Alert.alert("Error", "Something went wrong, please try again later"),
    });
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Pressable
              onPressOut={router.back}
              className="
    px-4 py-1.5
    rounded-full
    bg-neutral-100
    active:opacity-70
  "
            >
              <Text className="text-[14px] font-poppins-medium text-neutral-800">
                All
              </Text>
            </Pressable>
          ),
          title: "",
          headerShadowVisible: false,
        }}
      />

      {/* Ambient glow */}
      <View className="absolute -top-40 -right-40 w-[420px] h-[420px] bg-[#EFEAFF] opacity-40 blur-[160px]" />
      <View className="absolute bottom-[-120] left-[-120] w-[380px] h-[380px] bg-[#F7F3FF] opacity-30 blur-[160px]" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* ===== HERO CARD ===== */}
        <View className="px-5 pt-6">
          <View
            className="bg-white rounded-3xl border border-neutral-200/60 px-5 py-5"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 18,
              elevation: 4,
            }}
          >
            <Text className="text-[11px] tracking-widest text-neutral-400 mb-2">
              CONNECTION CONTEXT
            </Text>

            <Text className="text-[22px] font-poppins-semibold text-[#111]">
              {profile.first_name}
            </Text>

            <Text className="text-[15px] text-neutral-600 mt-1">
              liked your{" "}
              <Text className="text-[#7454F6] font-poppins-medium">
                {like.photo_url ? "photo" : "answer"}
              </Text>
            </Text>

            <View className="h-px bg-neutral-200 my-4" />

            <View className="flex-row gap-4 items-center">
              {like.photo_url ? (
                <View className="h-20 w-20 rounded-2xl overflow-hidden bg-neutral-200">
                  <Image
                    source={like.photo_url}
                    className="flex-1"
                    contentFit="cover"
                  />
                </View>
              ) : (
                <View className="flex-1 rounded-2xl bg-[#F7F5FF] px-4 py-3">
                  <Text className="text-[15px] font-playfair-semibold text-[#2E2E2E]">
                    {like.answer_text}
                  </Text>
                </View>
              )}

              <View className="flex-1">
                <Text className="text-[13px] text-neutral-500">
                  This caught their attention — take a moment to see if the
                  connection feels right.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ===== PROFILE ===== */}
        <View className="mt-10 px-5">
          <ProfileView profile={profile} />
        </View>
      </ScrollView>

      {/* ===== ACTION FABs ===== */}
      <View className="absolute bottom-6 left-0 right-0 px-8 flex-row justify-between">
        <Fab
          className="bg-white shadow-lg h-16 w-16"
          iconClassName="text-neutral-700 text-3xl"
          iconName="close"
          onPress={() => setShowRemoveConfirm(true)}
          loading={removePending}
          disabled={removePending || matchPending}
        />

        <Fab
          className="bg-[#7454F6] shadow-xl h-16 w-16"
          iconClassName="text-white text-3xl"
          iconName="heart"
          onPress={() => setShowMatchConfirm(true)}
          loading={matchPending}
          disabled={removePending || matchPending}
        />
      </View>

      {/* ===== REMOVE CONFIRMATION ===== */}
      <Modal visible={showRemoveConfirm} transparent animationType="fade">
        <View className="flex-1 bg-black/40 items-center justify-center px-6">
          <View className="w-full bg-white rounded-3xl px-6 py-6">
            <Text className="text-[20px] font-poppins-semibold text-center">
              Cancel this match?
            </Text>

            <Text className="text-[14px] text-neutral-600 text-center mt-2">
              This will remove the connection and chat for both of you.
            </Text>

            <View className="flex-row gap-4 mt-6">
              <Pressable
                className="flex-1 h-12 rounded-xl bg-neutral-100 items-center justify-center"
                onPress={() => setShowRemoveConfirm(false)}
              >
                <Text className="font-poppins-medium text-neutral-700">
                  Keep Match
                </Text>
              </Pressable>

              <Pressable
                className="flex-1 h-12 rounded-xl bg-[#FFEAEA] items-center justify-center"
                onPress={() => {
                  setShowRemoveConfirm(false);
                  handleRemove();
                }}
              >
                <Text className="font-poppins-semibold text-red-600">
                  Remove
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ===== MATCH CONFIRMATION ===== */}
      <Modal visible={showMatchConfirm} transparent animationType="fade">
        <View className="flex-1 bg-black/40 items-center justify-center px-6">
          <View
            className="w-full bg-white rounded-3xl px-6 py-7 items-center"
            style={{
              shadowColor: "#7454F6",
              shadowOpacity: 0.25,
              shadowRadius: 30,
              elevation: 10,
            }}
          >
            <View className="h-16 w-16 rounded-full bg-[#EFEAFF] items-center justify-center mb-4">
              <Text className="text-3xl">♡</Text>
            </View>

            <Text className="text-[22px] font-poppins-semibold text-center">
              It’s a Match!
            </Text>

            <Text className="text-[14px] text-neutral-600 text-center mt-2 px-4">
              You and {profile.first_name} liked each other. Start a
              conversation and see where it goes.
            </Text>

            <View className="w-full gap-3 mt-6">
              <Pressable
                className="h-12 rounded-xl bg-[#7454F6] items-center justify-center"
                onPress={() => {
                  setShowMatchConfirm(false);
                  handleMatch();
                }}
              >
                <Text className="text-white font-poppins-semibold">
                  Start Chat
                </Text>
              </Pressable>

              <Pressable
                className="h-11 items-center justify-center"
                onPress={() => setShowMatchConfirm(false)}
              >
                <Text className="text-neutral-500 font-poppins-medium">
                  Maybe later
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
