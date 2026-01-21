import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack, router } from "expo-router";
import { useCallback, useState } from "react";
import { View, Text, Pressable } from "react-native";
import * as Linking from "expo-linking";
import { StackHeaderV2 } from "@/components/stack-header-v2";

export default function ScanQRPage() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const handleBarcodeScanned = useCallback(
    ({ data }: { data: string }) => {
      if (scanned) return;
      if (!data.startsWith("soulsetu://profile/")) return;

      setScanned(true);
      const profileId = data.replace("soulsetu://profile/", "");
      router.replace(`/(app)/qr/scannedProfile.tsx/${profileId}`);
    },
    [scanned]
  );

  if (!permission) {
    return <View className="flex-1 bg-white" />;
  }

 //for particularly IOS this part is changed
  if (!permission.granted) {
    const permanentlyDenied =
      permission.canAskAgain === false;

    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        {/* Hide header */}
        <Stack.Screen options={{ headerShown: true }} />
        <StackHeaderV2 title="Scan QR" />

        <Text className="text-center text-neutral-700 mb-4">
          Camera permission is required to scan QR codes
        </Text>

        {!permanentlyDenied ? (
          /* First-time or retry */
          <Pressable
            onPress={requestPermission}
            className="px-6 py-3 rounded-xl bg-[#7454F6] mb-4"
          >
            <Text className="text-white font-poppins-semibold">
              Grant Permission
            </Text>
          </Pressable>
        ) : (
          /* Permanently denied */
          <Pressable
            onPress={() => Linking.openSettings()}
            className="px-6 py-3 rounded-xl bg-[#7454F6] mb-4"
          >
            <Text className="text-white font-poppins-semibold">
              Open Settings
            </Text>
          </Pressable>
        )}

        <Pressable
          onPress={() => router.back()}
          className="px-6 py-3 rounded-xl border border-neutral-300"
        >
          <Text className="text-neutral-700 font-poppins-semibold">
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <Stack.Screen options={{ headerShown: false }} />
      <StackHeaderV2 title="Scan QR" />

      <CameraView
        style={{ flex: 1 }}
        facing="back"
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />

      {/* Overlay */}
      <View className="absolute inset-0">
        <View className="flex-1 bg-black/50" />
        <View className="flex-row">
          <View className="flex-1 bg-black/50" />
          <View className="w-64 h-64 rounded-2xl border-2 border-white/80" />
          <View className="flex-1 bg-black/50" />
        </View>

        <View className="flex-1 bg-black/50 items-center pt-6">
          <View className="bg-white/90 px-5 py-2 rounded-full">
            <Text className="text-sm text-neutral-800">
              Align QR inside the frame
            </Text>
          </View>
          <Text className="text-xs text-white/70 mt-3">
            Scans automatically
          </Text>
        </View>
      </View>
    </View>
  );
}
