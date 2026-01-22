import { useEffect, useRef, useState } from "react";
import { Alert, FlatList, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  resolveProximitySession,
  startProximitySession,
} from "@/api/proximity";
import { bleService } from "@/services/BleService";
import { requestBlePermissions } from "./permissions";

type NearbyProfile = {
  profileId: string;
  firstName: string;
  age: number;
  photoUrl: string | null;
};

export default function Page() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyProfile[]>([]);
  const sessionTokenRef = useRef<string | null>(null);

  // -----------------------------
  // Ask permissions on page entry
  // -----------------------------
  useEffect(() => {
    requestBlePermissions().catch((err) =>
      console.error("BLE permission error:", err),
    );

    return () => {
      bleService.disable();
    };
  }, []);

  // -----------------------------
  // Toggle handler
  // -----------------------------
  const handleToggle = async (enabled: boolean) => {
    setIsEnabled(enabled);

    if (!enabled) {
      bleService.disable();
      sessionTokenRef.current = null;
      setNearbyUsers([]);
      return;
    }

    try {
      // 1️⃣ Start proximity session (RPC)
      const session = await startProximitySession();
      sessionTokenRef.current = session.session_token;

      // 2️⃣ Enable BLE with token
      await bleService.enable(
        session.session_token,
        async (_device, tokenPrefix) => {
          console.log("📲 UI received token prefix:", tokenPrefix);
          // 3️⃣ Resolve discovered token via backend
          const resolved = await resolveProximitySession(tokenPrefix);
          if (!resolved) {
            console.log("⚠️ Resolution returned null");
            return;
          }

          console.log("👤 Profile resolved:", resolved);

          setNearbyUsers((prev) => {
            if (prev.some((u) => u.profileId === resolved.profile_id)) {
              return prev;
            }

            return [
              ...prev,
              {
                profileId: resolved.profile_id,
                firstName: resolved.first_name,
                age: resolved.age,
                photoUrl: resolved.photo_url,
              },
            ];
          });
        },
      );
    } catch (err: any) {
      console.error("Failed to enable proximity:", err);

      bleService.disable();
      sessionTokenRef.current = null;
      setIsEnabled(false);

      if (err.message === "BLUETOOTH_OFF") {
        Alert.alert(
          "Bluetooth Off",
          "Please turn on Bluetooth to discover nearby users.",
        );
      } else {
        Alert.alert(
          "Nearby Discovery Error",
          "Unable to start nearby discovery.",
        );
      }
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <View className="flex-1 bg-[#FAFAFB]">
      <SafeAreaView edges={["top"]}>
        <View className="px-6 pt-4 pb-4">
          <Text className="text-[28px] font-poppins-semibold text-[#111]">
            Bluetooth Mode
          </Text>
          <Text className="text-[13px] text-neutral-500 mt-1">
            Discover nearby people using Bluetooth
          </Text>
        </View>
      </SafeAreaView>

      <View className="px-6 mt-4 flex-row items-center justify-between">
        <Text className="text-[16px] text-[#111]">Enable Nearby Discovery</Text>
        <Switch value={isEnabled} onValueChange={handleToggle} />
      </View>

      <View className="px-6 mt-6 flex-1">
        {isEnabled && nearbyUsers.length === 0 && (
          <Text className="text-center text-neutral-400 mt-10">
            Scanning for nearby users…
          </Text>
        )}

        <FlatList
          data={nearbyUsers}
          keyExtractor={(item) => item.profileId}
          renderItem={({ item }) => (
            <View className="p-4 mb-3 rounded-xl bg-white border border-neutral-200">
              <Text className="text-[15px] font-semibold">
                {item.firstName}, {item.age}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}
