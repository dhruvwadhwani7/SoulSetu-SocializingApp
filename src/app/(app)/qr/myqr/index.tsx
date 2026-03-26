import { useMyProfile } from "@/api/my-profile";
import { StackHeaderV2 } from "@/components/shared/stack-header-v2";
import * as MediaLibrary from "expo-media-library";
import { Stack } from "expo-router";
import * as Sharing from "expo-sharing";
import { useRef } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import ViewShot, { captureRef } from "react-native-view-shot";

export default function MyQRPage() {
  const { data: profile } = useMyProfile();
  const cardRef = useRef<View>(null);

  if (!profile) return null;

  const qrValue = `soulsetu://profile/${profile.id}`;
  const profilePhoto = profile.photos?.[0]?.photo_url ?? null;

  const captureImage = async () => {
    if (!cardRef.current) return null;
    return captureRef(cardRef, { format: "png", quality: 1 });
  };

  const handleShare = async () => {
    try {
      if (!cardRef.current) return;

      const uri = await captureRef(cardRef, {
        format: "png",
        quality: 1,
      });

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Sharing not available on this device");
        return;
      }

      await Sharing.shareAsync(uri);
    } catch (err) {
      Alert.alert("Error", "Unable to share QR");
    }
  };

  const handleSave = async () => {
    try {
      const uri = await captureImage();
      if (!uri) return;

      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission required");
        return;
      }

      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Saved", "QR saved to gallery");
    } catch {
      Alert.alert("Error", "Unable to save");
    }
  };

  return (
    <View className="flex-1 bg-white pt-6">
      <StackHeaderV2 title="myqr" />
      <Stack.Screen options={{ title: "My QR" }} />

      {/* ========= CAPTURE AREA ========= */}
      <ViewShot ref={cardRef} options={{ format: "png", quality: 1 }}>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            paddingBottom: 24,
          }}
        >
          <View className="items-center mt-6">
            {/* Avatar */}
            <View
              className="w-32 h-32 rounded-full bg-white items-center justify-center"
              style={{
                shadowColor: "#7454F6",
                shadowOpacity: 0.25,
                shadowRadius: 10,
                elevation: 7,
              }}
            >
              {profilePhoto ? (
                <Image
                  source={{ uri: profilePhoto }}
                  className="w-28 h-28 rounded-full"
                />
              ) : (
                <View className="w-28 h-28 rounded-full bg-neutral-200 items-center justify-center">
                  <Text className="text-4xl font-poppins-semibold text-neutral-500">
                    {profile.first_name?.[0]}
                  </Text>
                </View>
              )}
            </View>

            {/* Name */}
            <Text className="text-[22px] font-poppins-semibold mt-5 mb-8">
              {profile.first_name}
            </Text>
          </View>

          <View className="items-center">
            <QRCode value={qrValue} size={240} />

            <Text className="mt-6 text-sm text-neutral-500">
              Let someone scan to view your profile
            </Text>

            <View className="mt-3 px-8">
              <View className="bg-[#F6F4FF] rounded-2xl px-5 py-4">
                <Text className="text-center text-xs text-[#7454F6] leading-5">
                  This QR is unique to you.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ViewShot>

      {/* ========= SHARE BUTTON ========= */}
      <View className="px-6 mt-6 gap-3">
        {/* Primary */}
        <Pressable
          onPress={handleShare}
          className="bg-[#7454F6] py-4 rounded-2xl items-center"
        >
          <Text className="text-white font-poppins-semibold">Share QR</Text>
        </Pressable>

        {/* Secondary */}
        <Pressable
          onPress={handleSave}
          className="bg-[#F6F4FF] py-4 rounded-2xl items-center"
        >
          <Text className="text-[#7454F6] font-poppins-semibold">
            Save to Gallery
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
