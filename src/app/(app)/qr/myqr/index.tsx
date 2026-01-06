import { useMyProfile } from "@/api/my-profile";
import QRCode from "react-native-qrcode-svg";
import { Stack } from "expo-router";
import { StackHeaderV2 } from "@/components/stack-header-v2";
import { View, Text } from "react-native";

export default function MyQRPage() {
  const { data: profile } = useMyProfile();

  if (!profile) return null;

  const qrValue = `soulsetu://profile/${profile.id}`;

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <StackHeaderV2 title="myqr" />
      <Stack.Screen options={{ title: "My QR" }} />

      <QRCode value={qrValue} size={240} />

      <Text className="mt-6 text-sm text-neutral-500">
        Let someone scan to view your profile
      </Text>
      {/* Name */}
      <Text className="text-[22px] font-poppins-semibold mt-5">
        {profile?.first_name}
      </Text>

      {/* <Text>{qrValue}</Text> */}
    </View>
  );
}
