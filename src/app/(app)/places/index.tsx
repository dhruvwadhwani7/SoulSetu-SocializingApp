// app/(app)/places/index.tsx

import { useMyProfile } from "@/api/my-profile";
import PlaceCard from "@/components/foursqaure/PlaceCard";
import PlaceDetailsModal from "@/components/foursqaure/PlaceDetailsModal";
import { StackHeaderV2 } from "@/components/shared/stack-header-v2";
import {
  fetchNearbyPlaces,
  fetchPlaceDetails,
} from "@/services/foursqaure/foursquare.fetchers";
import {
  FoursquarePlace,
  FoursquarePlaceDetails,
} from "@/types/foursqaure/foursqaure.types";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";

export default function PlacesPage() {
  const { data: profile } = useMyProfile();
  const lat = profile?.latitude;
  const lng = profile?.longitude;

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: places } = useQuery<FoursquarePlace[]>({
    queryKey: ["places", lat, lng],
    queryFn: () => fetchNearbyPlaces(lat!, lng!),
    enabled: !!lat && !!lng,
  });

  const { data: details } = useQuery<FoursquarePlaceDetails>({
    queryKey: ["placeDetails", selectedId],
    queryFn: () => fetchPlaceDetails(selectedId!),
    enabled: !!selectedId,
  });

  return (
    <View className="flex-1 bg-[#FDFDFF]">
      <StackHeaderV2 title="Explore Spots" />

      {/* Header */}
      <View className="px-5 pt-6 mb-4">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-[26px] font-poppins-bold text-[#1A1A1A]">
            Perfect Spots
          </Text>

          <View className="bg-[#7454F6]/10 px-3 py-1 rounded-xl flex-row items-center">
            <View className="w-1.5 h-1.5 rounded-full bg-[#7454F6] mr-2" />
            <Text className="text-[10px] font-poppins-bold text-[#7454F6]">
              LIVE
            </Text>
          </View>
        </View>

        {/* Location */}
        <View className="flex-row items-center mt-2">
          <Ionicons name="location" size={15} color="#7454F6" />
          <Text className="ml-2 text-[14px] font-poppins-semibold text-[#1A1A1A]">
            Places near {profile?.neighborhood ?? "you"}
          </Text>
        </View>
      </View>

      <FlatList
        data={places}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <PlaceCard place={item} onPress={() => setSelectedId(item.id)} />
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />

      <PlaceDetailsModal
        visible={!!selectedId}
        place={details}
        onClose={() => setSelectedId(null)}
      />
    </View>
  );
}
