import { StackHeaderV2 } from "@/components/stack-header-v2";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMyProfile } from "@/api/my-profile";
import { useQuery } from "@tanstack/react-query";
import { fetchPlaces } from "../../../services/places";
import { Place } from "@/types/places";

export default function PlacesPage() {
  const { data: profile } = useMyProfile();

  const lat = profile?.latitude;
  const lng = profile?.longitude;

  const {
    data: places,
    isLoading,
    isError,
  } = useQuery<Place[]>({
    queryKey: ["places", lat, lng],
    queryFn: () => fetchPlaces(lat!, lng!),
    enabled: !!lat && !!lng,
  });

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      <StackHeaderV2 title="Places" />

      <View className="absolute -top-20 -right-20 w-72 h-72 bg-[#F1EDFF] opacity-40 blur-3xl" />
      <View className="absolute bottom-[-80] left-[-80] w-80 h-80 bg-[#F8FAFF] opacity-40 blur-3xl" />

      <ScrollView
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="mb-5 mt-1">
          <Text className="text-[22px] font-poppins-semibold text-[#111]">
            Perfect Meet Spots
          </Text>

          <View
            className="mt-3 self-start rounded-full px-4 py-2 flex-row items-center"
            style={{
              backgroundColor: "#F5F3FF",
              shadowColor: "#7454F6",
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Ionicons name="location-outline" size={14} color="#6B5CF6" />

            <Text className="ml-1.5 text-[12px] font-poppins-medium text-[#6B5CF6] tracking-wide">
              {profile?.neighborhood ?? "Your area"}
            </Text>
          </View>
        </View>

        {isLoading && (
          <CenteredState
            icon="location-outline"
            title="Finding places"
            subtitle="Looking for great spots around you…"
          />
        )}

        {isError && (
          <CenteredState
            icon="alert-circle-outline"
            title="Couldn’t load places"
            subtitle="Please try again in a moment."
          />
        )}

        {!isLoading && !isError && places?.length === 0 && (
          <CenteredState
            icon="location-outline"
            title="No places nearby"
            subtitle="Try exploring a different area."
          />
        )}


        {!isLoading &&
          !isError &&
          places?.map((place) => (
            <Pressable
              key={place.id}
              className="mb-4"
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.98 : 1 }],
                opacity: pressed ? 0.95 : 1,
              })}
            >
              <View
                className="
                  bg-white
                  rounded-3xl
                  border border-neutral-200
                  px-5 py-5
                "
                style={{
                  shadowColor: "#000",
                  shadowOpacity: 0.05,
                  shadowRadius: 14,
                  elevation: 3,
                }}
              >
                {/* Top row */}
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-[16px] font-poppins-semibold text-[#111]">
                      {place.name}
                    </Text>

                    {place.category && (
                      <Text className="text-[12px] text-[#7454F6] mt-1 tracking-wide">
                        {place.category}
                      </Text>
                    )}
                  </View>

                  <View className="h-10 w-10 rounded-full bg-[#F1EDFF] items-center justify-center">
                    <Ionicons
                      name="location-outline"
                      size={18}
                      color="#5A3FE3"
                    />
                  </View>
                </View>

                {/* Address */}
                {place.address && (
                  <Text className="text-[13px] text-neutral-500 mt-3 leading-relaxed">
                    {place.address}
                  </Text>
                )}

                {/* Distance */}
                {place.distance && (
                  <View className="mt-4 self-start rounded-full bg-[#F5F3FF] px-3 py-1">
                    <Text className="text-[12px] text-[#6B5CF6] tracking-wide">
                      {(place.distance / 1000).toFixed(1)} km away
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          ))}
      </ScrollView>
    </View>
  );
}


function CenteredState({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}) {
  return (
    <View className="items-center justify-center mt-24 px-8">
      <View className="w-16 h-16 rounded-full bg-[#F1EDFF] items-center justify-center">
        <Ionicons name={icon} size={26} color="#7454F6" />
      </View>

      <Text className="text-[16px] font-poppins-semibold text-[#111] mt-5 text-center">
        {title}
      </Text>

      <Text className="text-[13px] text-neutral-500 mt-1 text-center leading-relaxed">
        {subtitle}
      </Text>
    </View>
  );
}
