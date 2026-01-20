import { useEffect, useState } from "react";
import { Alert, FlatList, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useMyProfile } from "@/api/my-profile";
import { bleService } from "@/services/BleService";
import { requestBlePermissions } from "./permissions";

type NearbyUser = {
  userId: string; // discovered user id (from BLE payload)
  deviceId: string; // BLE device id
};

export default function Page() {
  const { data: profile } = useMyProfile();

  const [isEnabled, setIsEnabled] = useState(false);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);

  // -----------------------------
  // Ask permissions on page entry
  // -----------------------------
  useEffect(() => {
    (async () => {
      try {
        await requestBlePermissions();
      } catch (err) {
        console.error("BLE permission error:", err);
      }
    })();

    // Stop BLE when leaving page
    return () => {
      bleService.disable();
    };
  }, []);

  if (!profile) return null;

  const userId = profile.id;

  // -----------------------------
  // Toggle handler
  // -----------------------------
  const handleToggle = async (enabled: boolean) => {
    setIsEnabled(enabled);

    if (!enabled) {
      bleService.disable();
      setNearbyUsers([]);
      return;
    }

    try {
      await bleService.enable(userId, (device, discoveredUserId) => {
        // Ignore self
        if (discoveredUserId === userId) return;

        setNearbyUsers((prev) => {
          if (prev.some((u) => u.userId === discoveredUserId)) {
            return prev;
          }

          return [
            ...prev,
            {
              userId: discoveredUserId,
              deviceId: device.id,
            },
          ];
        });
      });
    } catch (err: any) {
      console.error("Failed to enable BLE:", err);

      if (err.message === "BLUETOOTH_OFF") {
        Alert.alert(
          "Bluetooth Off",
          "Please turn on Bluetooth to discover nearby users."
        );
      } else {
        Alert.alert("Bluetooth Error", "Unable to start nearby discovery.");
      }

      setIsEnabled(false);
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <View className="flex-1 bg-[#FAFAFB]">
      {/* Ambient background */}
      <View className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-[#EFEAFF] opacity-35 blur-[160px]" />

      {/* ===== HEADER ===== */}
      <SafeAreaView edges={["top"]}>
        <View className="px-6 pt-4 pb-4">
          <Text className="text-[28px] font-poppins-semibold text-[#111]">
            Bluetooth Mode
          </Text>

          <Text className="text-[13px] text-neutral-500 mt-1">
            Discover nearby people using Bluetooth
          </Text>

          <View className="mt-4 h-px bg-neutral-200/70" />
        </View>
      </SafeAreaView>

      {/* ===== TOGGLE ===== */}
      <View className="px-6 mt-4 flex-row items-center justify-between">
        <Text className="text-[16px] text-[#111]">Enable Nearby Discovery</Text>
        <Switch value={isEnabled} onValueChange={handleToggle} />
      </View>

      {/* ===== LIST ===== */}
      <View className="px-6 mt-6 flex-1">
        {isEnabled && nearbyUsers.length === 0 && (
          <Text className="text-center text-neutral-400 mt-10">
            Scanning for nearby users…
          </Text>
        )}

        <FlatList
          data={nearbyUsers}
          keyExtractor={(item) => item.userId}
          renderItem={({ item }) => (
            <View
              className="p-4 mb-3 rounded-xl bg-white shadow-sm border border-neutral-200"
              onTouchEnd={() => console.log(`${item.userId} Clicked`)}
            >
              <Text className="text-[15px] font-semibold text-[#111]">
                User ID
              </Text>
              <Text className="text-[12px] text-neutral-500 mt-1">
                {item.userId}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}
