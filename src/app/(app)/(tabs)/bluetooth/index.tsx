import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  FlatList,
  Image as RNImage,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  const router = useRouter();
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
  // -----------------------------
  useEffect(() => {
    if (!isEnabled) return;

    const interval = setInterval(() => {
      setNearbyUsers((prev) =>
        prev.filter((u) => Date.now() - u.lastSeen < 35000),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isEnabled]);

  // -----------------------------
  // RESOLVE WITH RETRY
  // -----------------------------
  const resolveWithRetry = async (prefix: string) => {
    for (let i = 0; i < 2; i++) {
      try {
        const res = await resolveProximitySession(prefix);
        if (res) return res;
      } catch {}
      await new Promise((r) => setTimeout(r, 500));
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
      const session = await startProximitySession();
      sessionTokenRef.current = session.session_token;

      await bleService.enable(
        session.session_token,
        async (_device, tokenPrefix) => {
          console.log("📲 Token detected:", tokenPrefix);

          const now = Date.now();

          const resolved = await resolveWithRetry(tokenPrefix);

          // 🟢 IMPORTANT FIX
          // Even if resolve fails (cooldown), refresh lastSeen
          if (!resolved) {
            setNearbyUsers((prev) =>
              prev.map((u) =>
                tokenPrefix.startsWith(u.profileId.slice(0, 4))
                  ? { ...u, lastSeen: now }
                  : u,
              ),
            );
            return;
          }

          setNearbyUsers((prev) => {
            const existing = prev.find(
              (u) => u.profileId === resolved.profile_id,
            );

            if (existing) {
              return prev.map((u) =>
                u.profileId === resolved.profile_id
                  ? { ...u, lastSeen: now }
                  : u,
              );
            }

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
  // ANIMATION & UI STATES
  // -----------------------------
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (isEnabled && nearbyUsers.length === 0) {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.5,
              duration: 1500,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 1500,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 0.5,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
      fadeAnim.setValue(0.5);
    }
  }, [isEnabled, nearbyUsers.length, pulseAnim, fadeAnim]);

  const renderEmptyState = () => {
    if (!isEnabled) {
      return (
        <View className="flex-1 items-center justify-center mt-20">
          <View className="w-24 h-24 rounded-full bg-neutral-100 items-center justify-center mb-6">
            <Ionicons name="bluetooth" size={40} color="#9CA3AF" />
          </View>
          <Text className="text-[18px] font-medium text-neutral-800 text-center">
            Bluetooth is Off
          </Text>
          <Text className="text-[14px] text-neutral-500 mt-2 text-center px-10">
            Enable discovery above to find people nearby you
          </Text>
        </View>
      );
    }

    return (
      <View className="flex-1 items-center justify-center mt-20">
        <View className="items-center justify-center h-48 w-48 relative">
          <Animated.View
            style={{
              position: "absolute",
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "#6366f1",
              opacity: fadeAnim,
              transform: [{ scale: pulseAnim }],
            }}
          />
          <View className="w-20 h-20 rounded-full bg-indigo-500 items-center justify-center shadow-lg shadow-indigo-300">
            <Ionicons name="scan" size={32} color="white" />
          </View>
        </View>
        <Text className="text-[18px] font-medium text-neutral-800 text-center mt-4">
          Scanning Nearby
        </Text>
        <Text className="text-[14px] text-neutral-500 mt-2 text-center px-10">
          Looking for other people waiting to connect in your area...
        </Text>
      </View>
    );
  };

  // -----------------------------
  // MAIN UI
  // -----------------------------
  return (
    <View className="flex-1 bg-[#FAFAFB]">
      <SafeAreaView edges={["top"]}>
        <View className="px-6 pt-6 pb-2">
          <View className="flex-row justify-between items-center">
            <View>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "700",
                  color: "#111827",
                  letterSpacing: -0.5,
                }}
              >
                Discover
              </Text>
              <Text className="text-[14px] text-neutral-500 mt-1">
                Find people near you via Bluetooth
              </Text>
            </View>
            <View className="w-12 h-12 rounded-full bg-indigo-50 items-center justify-center">
              <Ionicons name="bluetooth" size={24} color="#4f46e5" />
            </View>
          </View>
        </View>
      </SafeAreaView>

      <View
        className="mx-6 mt-4 p-1 rounded-2xl bg-white border border-neutral-100 flex-row items-center justify-between"
        style={{
          elevation: 2,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        }}
      >
        <View className="flex-row items-center pl-4 py-3 flex-1">
          <View
            className={`w-2 h-2 rounded-full ${isEnabled ? "bg-green-500" : "bg-neutral-300"} mr-3`}
          />
          <View>
            <Text style={{ fontSize: 15, fontWeight: "600", color: "#111827" }}>
              Radar Status
            </Text>
            <Text className="text-[12px] text-neutral-500">
              {isEnabled ? "Actively scanning..." : "Paused"}
            </Text>
          </View>
        </View>
        <View className="pr-4">
          <Switch
            value={isEnabled}
            onValueChange={handleToggle}
            trackColor={{ false: "#e5e5e5", true: "#c7d2fe" }}
            thumbColor={isEnabled ? "#4f46e5" : "#f4f3f4"}
          />
        </View>
      </View>

      <View className="px-6 mt-6 flex-1">
        <FlatList
          data={nearbyUsers}
          keyExtractor={(item) => item.profileId}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={{ paddingBottom: 60, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Animated.View
              style={{
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1], // subtle pulse on the cards too
                }),
                transform: [{ translateY: index % 2 === 0 ? 0 : 20 }], // stagger effect
                marginBottom: 24,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => router.push(`/bluetooth/${item.profileId}`)}
              >
                <View
                  className="rounded-[32px] bg-white overflow-hidden"
                  style={{
                    elevation: 8,
                    shadowColor: "#4f46e5",
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.1,
                    shadowRadius: 20,
                  }}
                >
                  <View className="h-44 w-full relative bg-neutral-100">
                    {item.photoUrl ? (
                      <RNImage
                        source={{ uri: item.photoUrl }}
                        style={{
                          width: "100%",
                          height: "100%",
                          resizeMode: "cover",
                        }}
                      />
                    ) : (
                      <View className="flex-1 items-center justify-center bg-indigo-50">
                        <Ionicons name="person" size={50} color="#c7d2fe" />
                      </View>
                    )}

                    <LinearGradient
                      colors={["transparent", "rgba(0,0,0,0.8)"]}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "60%",
                      }}
                    />

                    {/* Live Badge */}
                    <View className="absolute top-4 left-4 flex-row items-center bg-black/40 px-3 py-1.5 rounded-full border border-white/20">
                      <View className="w-2 h-2 rounded-full bg-green-400 mr-2" />
                      <Text className="text-white text-[11px] font-poppins-semibold tracking-wider">
                        NEARBY SECS AGO
                      </Text>
                    </View>

                    {/* Name & Age Overlay */}
                    <View className="absolute bottom-4 left-5 right-5 flex-row justify-between items-end">
                      <View>
                        <Text className="text-white text-[24px] font-poppins-bold tracking-tight shadow-sm">
                          {item.firstName}
                        </Text>
                        <Text className="text-neutral-300 text-[14px] font-medium mt-0.5">
                          {item.age} years old
                        </Text>
                      </View>

                      <View className="w-12 h-12 rounded-full bg-indigo-500 items-center justify-center flex-row">
                        <Ionicons
                          name="arrow-forward"
                          size={20}
                          color="white"
                        />
                      </View>
                    </View>
                  </View>

                  {/* Fun Bottom Bar */}
                  <View className="px-5 py-4 bg-white flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="w-8 h-8 rounded-full bg-orange-50 items-center justify-center mr-3">
                        <Text className="text-[14px]">👋</Text>
                      </View>
                      <Text className="text-[#111827] text-[13px] font-medium">
                        Say Hi via Bluetooth!
                      </Text>
                    </View>
                    <Ionicons name="bluetooth" size={16} color="#6366f1" />
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
        />
      </View>
    </View>
  );
}
