// components/foursquare/PlaceCard.tsx

import { FoursquarePlace } from "@/types/foursqaure/foursqaure.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  place: FoursquarePlace;
  onPress: () => void;
};

export default function PlaceCard({ place, onPress }: Props) {
  return (
    <Pressable onPress={onPress} className="mb-3 px-5">
      <View
        className="rounded-2xl border border-[#F0F0F5] bg-white px-5 py-4"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.04,
          shadowRadius: 10,
          elevation: 2,
        }}
      >
        <View className="flex-row items-center justify-between">
          {/* Left */}
          <View className="flex-1 pr-3">
            {place.category && (
              <Text className="text-[10px] font-poppins-bold text-[#7454F6] mb-1">
                {place.category}
              </Text>
            )}

            <Text className="text-[16px] font-poppins-semibold text-[#1A1A1A]">
              {place.name}
            </Text>
          </View>

          {/* Right */}
          <View className="flex-row items-center">
            {place.distance && (
              <Text className="text-[12px] font-poppins-medium text-[#7454F6] mr-2">
                {(place.distance / 1000).toFixed(1)} km
              </Text>
            )}

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#C7C7CC"
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}