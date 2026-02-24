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
  lastSeen: number;
};

export default function Page() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyProfile[]>([]);
  const sessionTokenRef = useRef<string | null>(null);

  // -----------------------------
  // PERMISSIONS
  // -----------------------------
  useEffect(() => {
    requestBlePermissions().catch(console.error);

    return () => {
      bleService.disable();
    };
  }, []);

  // -----------------------------
  // PRESENCE CLEANUP LOOP
  // Removes users not seen recently
  // -----------------------------
  useEffect(() => {
    if (!isEnabled) return;

    const interval = setInterval(() => {
      setNearbyUsers(
        (prev) => prev.filter((u) => Date.now() - u.lastSeen < 15000), // 15s timeout
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isEnabled]);

  // -----------------------------
  // RESOLVE WITH RETRY
  // Handles timing issues
  // -----------------------------
  const resolveWithRetry = async (prefix: string) => {
    for (let i = 0; i < 3; i++) {
      try {
        const res = await resolveProximitySession(prefix);
        if (res) return res;
      } catch {}
      await new Promise((r) => setTimeout(r, 600));
    }
    return null;
  };

  // -----------------------------
  // TOGGLE HANDLER
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
      // Start session
      const session = await startProximitySession();
      sessionTokenRef.current = session.session_token;

      await bleService.enable(
        session.session_token,
        async (_device, tokenPrefix) => {
          console.log("📲 Token detected:", tokenPrefix);

          const resolved = await resolveWithRetry(tokenPrefix);
          if (!resolved) return;

          console.log("👤 Resolved:", resolved);

          const now = Date.now();

          setNearbyUsers((prev) => {
            const existing = prev.find(
              (u) => u.profileId === resolved.profile_id,
            );

            // update lastSeen if already exists
            if (existing) {
              return prev.map((u) =>
                u.profileId === resolved.profile_id
                  ? { ...u, lastSeen: now }
                  : u,
              );
            }

            // add new
            return [
              ...prev,
              {
                profileId: resolved.profile_id,
                firstName: resolved.first_name,
                age: resolved.age,
                photoUrl: resolved.photo_url,
                lastSeen: now,
              },
            ];
          });
        },
      );
    } catch (err: any) {
      console.error("Enable error:", err);

      bleService.disable();
      sessionTokenRef.current = null;
      setIsEnabled(false);

      if (err.message === "BLUETOOTH_OFF") {
        Alert.alert("Bluetooth Off", "Turn on Bluetooth");
      } else {
        Alert.alert("Error", "Unable to start discovery");
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
