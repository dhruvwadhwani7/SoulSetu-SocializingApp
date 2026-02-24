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
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
      fadeAnim.setValue(0.5);
    }
  }, [isEnabled, nearbyUsers.length]);

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
              position: 'absolute',
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: '#6366f1',
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
              <Text style={{ fontSize: 28, fontWeight: '700', color: '#111827', letterSpacing: -0.5 }}>
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
        style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
      >
        <View className="flex-row items-center pl-4 py-3 flex-1">
          <View className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-green-500' : 'bg-neutral-300'} mr-3`} />
          <View>
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>
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
            trackColor={{ false: '#e5e5e5', true: '#c7d2fe' }}
            thumbColor={isEnabled ? '#4f46e5' : '#f4f3f4'}
          />
        </View>
      </View>

      <View className="px-6 mt-6 flex-1">
        <FlatList
          data={nearbyUsers}
          keyExtractor={(item) => item.profileId}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => router.push(`/bluetooth/${item.profileId}`)}
              className="mb-4"
            >
              <LinearGradient
                colors={['#ffffff', '#f8fafc']}
                className="p-4 rounded-2xl flex-row items-center justify-between border border-neutral-100 shadow-sm"
                style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-50 relative bg-indigo-50 items-center justify-center">
                    {item.photoUrl ? (
                      <Image 
                        source={{ uri: item.photoUrl }} 
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                        transition={200}
                      />
                    ) : (
                      <Ionicons name="person" size={24} color="#6366f1" />
                    )}
                    <View className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
                  </View>
                  <View className="ml-4 flex-1">
                    <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 2 }}>
                      {item.firstName}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <View className="bg-indigo-50 px-2 py-0.5 rounded-md flex-row items-center">
                        <Ionicons name="body-outline" size={12} color="#4f46e5" />
                        <Text style={{ fontSize: 12, fontWeight: '500', color: '#4f46e5', marginLeft: 4 }}>
                          {item.age} yrs
                        </Text>
                      </View>
                      <Text className="text-[12px] text-neutral-400 ml-3">
                        Nearby now
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View className="w-10 h-10 rounded-full bg-indigo-50 items-center justify-center">
                  <Ionicons name="chevron-forward" size={20} color="#4f46e5" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}
