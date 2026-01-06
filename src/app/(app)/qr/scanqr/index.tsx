import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack, router } from "expo-router";
import { useCallback, useState } from "react";
import { View, Text, Pressable } from "react-native";
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

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-center text-neutral-700 mb-4">
          Camera permission is required to scan QR codes
        </Text>
        <Pressable
          onPress={requestPermission}
          className="px-6 py-3 rounded-xl bg-[#7454F6]"
        >
          <Text className="text-white font-poppins-semibold">
            Grant Permission
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StackHeaderV2 title="scanqr"/>
      <Stack.Screen options={{ title: "Scan QR" }} />

      <CameraView
        style={{ flex: 1 }}
        facing="back"          // ✅ FIX HERE
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />

      <View className="absolute inset-0 items-center justify-center">
        <View className="w-64 h-64 border-2 border-white/70 rounded-2xl" />
        <Text className="text-white mt-4 text-sm">
          Align QR within the frame
        </Text>
      </View>
    </View>
  );
}
