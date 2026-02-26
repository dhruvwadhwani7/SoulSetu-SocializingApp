import { useMyProfile } from "@/api/my-profile";
import { StackHeaderV2 } from "@/components/stack-header-v2";
import { Place } from "@/types/places";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import * as WebBrowser from "expo-web-browser";
import React, { memo, useCallback } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { fetchPlaces } from "../../../services/places";

export default function PlacesPage() {
  const { data: profile } = useMyProfile();

  const lat = profile?.latitude;
  const lng = profile?.longitude;

  const {
    data: places,
    isLoading,
    isError,
    refetch,
  } = useQuery<Place[]>({
    queryKey: ["places", lat, lng],
    queryFn: () => fetchPlaces(lat!, lng!),
    enabled: !!lat && !!lng,
  });

  const renderItem = useCallback(
    ({ item, index }: { item: Place; index: number }) => (
      <PlaceCard place={item} index={index} />
    ),
    [],
  );

  const ListHeader = useCallback(
    () => (
      <Animated.View
        entering={FadeInDown.duration(400)}
        className="mb-8 px-5 pt-6"
      >
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-[28px] font-poppins-bold text-[#1A1A1A] leading-tight">
            Perfect Spots
          </Text>
          <View className="bg-[#7454F6]/10 px-3 py-1.5 rounded-2xl flex-row items-center">
            <View className="w-1.5 h-1.5 rounded-full bg-[#7454F6] mr-2" />
            <Text className="text-[11px] font-poppins-bold text-[#7454F6] uppercase tracking-[0.5px]">
              LIVE
            </Text>
          </View>
        </View>
        <Text className="text-[14px] font-poppins-medium text-neutral-400">
          Handpicked locations near you
        </Text>

        <LocationTag neighborhood={profile?.neighborhood} />
      </Animated.View>
    ),
    [profile?.neighborhood],
  );

  return (
    <View className="flex-1 bg-[#FDFDFF]">
      <StackHeaderV2 title="Explore Spots" />

      {/* Optimized Decorative Background Elements (Removed Blur Filter) */}
      <View
        className="absolute -top-10 -right-20 w-80 h-80 bg-[#7454F6] opacity-[0.05]"
        style={{ borderRadius: 160 }}
      />
      <View
        className="absolute top-1/3 -left-20 w-72 h-72 bg-[#439CFF] opacity-[0.03]"
        style={{ borderRadius: 144 }}
      />
      <View
        className="absolute bottom-[-10] right-[-10] w-64 h-64 bg-[#FF6B6B] opacity-[0.03]"
        style={{ borderRadius: 128 }}
      />

      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          isLoading ? (
            <CenteredState
              icon="location-outline"
              title="Finding places"
              subtitle="Curating the best spots around you…"
            />
          ) : isError ? (
            <CenteredState
              icon="alert-circle-outline"
              title="Couldn’t load places"
              subtitle="We encountered a minor glitch. Please try again."
              onRetry={refetch}
            />
          ) : (
            <CenteredState
              icon="map-outline"
              title="No places nearby"
              subtitle="We couldn't find any spots in this specific area yet."
            />
          )
        }
      />
    </View>
  );
}

function LocationTag({ neighborhood }: { neighborhood?: string }) {
  return (
    <View className="mt-4 flex-row items-center">
      <Ionicons name="location" size={16} color="#7454F6" />
      <Text className="text-[15px] font-poppins-semibold text-[#1A1A1A] ml-2">
        {neighborhood ?? "Discovery Mode"}
      </Text>
    </View>
  );
}

const PlaceCard = memo(function PlaceCard({
  place,
  index,
}: {
  place: Place;
  index: number;
}) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(pressed.value ? 0.98 : 1, {
          damping: 15,
          stiffness: 150,
        }),
      },
    ],
    backgroundColor: withSpring(pressed.value ? "#FDFDFF" : "#FFFFFF"),
  }));

  const handlePress = async () => {
    if (place.website) {
      await WebBrowser.openBrowserAsync(place.website, {
        readerMode: false,
        dismissButtonStyle: "close",
        enableBarCollapsing: true,
      });
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).duration(400)}
      className="mb-5 px-5"
    >
      <Pressable
        onPressIn={() => (pressed.value = 1)}
        onPressOut={() => (pressed.value = 0)}
        onPress={handlePress}
      >
        <Animated.View
          style={[
            animatedStyle,
            {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.04,
              shadowRadius: 16,
              elevation: 4,
            },
          ]}
          className="rounded-[32px] border border-[#F0F0F5] overflow-hidden"
        >
          <View className="px-6 pt-6 pb-5">
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1">
                {place.category && (
                  <View className="bg-[#7454F6]/10 self-start px-2 py-0.5 rounded-lg mb-2">
                    <Text className="text-[10px] font-poppins-bold text-[#7454F6] uppercase tracking-[0.5px]">
                      {place.category}
                    </Text>
                  </View>
                )}
                <Text className="text-[18px] font-poppins-bold text-[#1A1A1A] leading-tight">
                  {place.name}
                </Text>
              </View>

              <View className="h-10 w-10 rounded-xl bg-[#F8F7FF] items-center justify-center border border-[#EEEBFF]">
                <Ionicons
                  name={place.website ? "globe-outline" : "chevron-forward"}
                  size={18}
                  color="#7454F6"
                />
              </View>
            </View>

            {place.address && (
              <View className="flex-row items-start mb-5">
                <Ionicons
                  name="map-outline"
                  size={12}
                  color="#A0A0A0"
                  style={{ marginTop: 2 }}
                />
                <Text
                  className="text-[12px] font-poppins-medium text-neutral-400 flex-1 ml-2 leading-[18px]"
                  numberOfLines={2}
                >
                  {place.address}
                </Text>
              </View>
            )}

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="bg-[#10B981] w-1.5 h-1.5 rounded-full mr-2" />
                <Text className="text-[11px] font-poppins-bold text-neutral-500">
                  Highly Rated
                </Text>
              </View>

              {place.distance && (
                <View className="flex-row items-center bg-[#F8F7FF] px-2.5 py-1 rounded-lg">
                  <Ionicons name="navigate-outline" size={10} color="#7454F6" />
                  <Text className="text-[11px] font-poppins-bold text-[#7454F6] ml-1.5">
                    {(place.distance / 1000).toFixed(1)} km
                  </Text>
                </View>
              )}
            </View>
          </View>

          {place.website && (
            <View className="bg-[#7454F6] py-2.5 items-center flex-row justify-center">
              <Text className="text-white text-[11px] font-poppins-bold tracking-wide mr-2">
                VISIT WEBSITE
              </Text>
              <Ionicons name="arrow-forward" size={10} color="white" />
            </View>
          )}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
});

function CenteredState({
  icon,
  title,
  subtitle,
  onRetry,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onRetry?: () => void;
}) {
  return (
    <Animated.View
      entering={FadeInDown.duration(600)}
      className="items-center justify-center mt-20 px-10"
    >
      <View className="w-20 h-20 rounded-[32px] bg-[#F8F7FF] items-center justify-center mb-5 border border-[#EEEBFF]">
        <Ionicons name={icon} size={32} color="#7454F6" />
      </View>

      <Text className="text-[18px] font-poppins-bold text-[#1A1A1A] mb-1.5 text-center">
        {title}
      </Text>

      <Text className="text-[13px] font-poppins-medium text-neutral-400 text-center leading-[20px] mb-6">
        {subtitle}
      </Text>

      {onRetry && (
        <Pressable
          onPress={onRetry}
          className="bg-[#7454F6] px-6 py-3 rounded-xl shadow-lg shadow-[#7454F6]/20"
        >
          <Text className="text-white font-poppins-bold text-[14px]">
            Try Again
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}
