import { createGroupChannelListFragment } from "@sendbird/uikit-react-native";
import { router, Stack } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* ---------- Header ---------- */
const CustomHeader = () => {
  return (
    <Stack.Screen
      options={{
        headerShown: false,
      }}
    />
  );
};

/* ---------- Sendbird Fragment ---------- */
const GroupChannelListFragment = createGroupChannelListFragment({
  Header: CustomHeader,
});

/* ---------- Page ---------- */
export default function Page() {
  return (
    <View className="flex-1 bg-[#FAFAFB]">
      {/* Ambient glow */}
      <View className="absolute -top-40 -right-40 w-[420px] h-[420px] bg-[#EFEAFF] opacity-35 blur-[160px]" />
      <View className="absolute bottom-[-120] left-[-120] w-[380px] h-[380px] bg-[#F7F3FF] opacity-30 blur-[160px]" />

      {/* SAFE HEADER */}
      <SafeAreaView edges={["top"]}>
        <View className="px-6 pt-4 pb-4">
          <Text className="text-[28px] font-poppins-semibold text-[#111]">
            Matches
          </Text>

          <Text className="text-[13px] text-neutral-500 mt-1">
            Conversations that matter
          </Text>

          <View className="mt-4 h-px bg-neutral-200/70" />
        </View>
      </SafeAreaView>

      {/* Chat List Container */}
      <View
        className="flex-1 mx-4 mb-4 rounded-3xl bg-white overflow-hidden"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 20,
          elevation: 4,
        }}
      >
        <GroupChannelListFragment
          channelListQueryParams={{
            includeEmpty: true,
          }}
          onPressCreateChannel={() => {}}
          onPressChannel={(channel) => {
            router.push(`/matches/${channel.url}`);
          }}
        />
      </View>
    </View>
  );
}
