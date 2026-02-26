// components/foursquare/PlaceDetailsModal.tsx

import { FoursquarePlaceDetails } from "@/types/foursqaure/foursqaure.types";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  place?: FoursquarePlaceDetails;
  onClose: () => void;
};

export default function PlaceDetailsModal({
  visible,
  place,
  onClose,
}: Props) {
  if (!place) return null;

  const openWebsite = () => {
    if (place.website) WebBrowser.openBrowserAsync(place.website);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      {/* Overlay */}
      <Pressable
        className="flex-1 bg-black/40 justify-center items-center px-5"
        onPress={onClose}
      >
        {/* Card */}
        <Pressable
          onPress={() => {}}
          className="w-full bg-white rounded-3xl p-6 max-h-[80%]"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-start mb-4">
            <Text className="text-[18px] font-poppins-bold text-[#1A1A1A] flex-1 pr-3">
              {place.name}
            </Text>

            <Pressable onPress={onClose}>
              <Ionicons name="close" size={22} color="#1A1A1A" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Category */}
            {place.category && (
              <View className="bg-[#7454F6]/10 self-start px-3 py-1 rounded-lg mb-4">
                <Text className="text-[#7454F6] font-poppins-semibold text-[12px]">
                  {place.category}
                </Text>
              </View>
            )}

            {/* Address */}
            {place.address && (
              <View className="mb-4">
                <Text className="text-[12px] font-poppins-bold text-neutral-400 mb-1">
                  ADDRESS
                </Text>

                <View className="flex-row items-start">
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color="#7454F6"
                    style={{ marginTop: 2 }}
                  />
                  <Text className="ml-2 text-neutral-700 flex-1">
                    {place.address}
                  </Text>
                </View>
              </View>
            )}

            {/* Contact */}
            {place.tel && (
              <View className="mb-4">
                <Text className="text-[12px] font-poppins-bold text-neutral-400 mb-1">
                  CONTACT
                </Text>
                <Text className="text-neutral-700">📞 {place.tel}</Text>
              </View>
            )}

            {/* Rating */}
            {place.rating && (
              <View className="mb-4">
                <Text className="text-[12px] font-poppins-bold text-neutral-400 mb-1">
                  RATING
                </Text>
                <Text className="text-neutral-700">⭐ {place.rating}</Text>
              </View>
            )}

            {/* Description */}
            {place.description && (
              <View className="mb-6">
                <Text className="text-[12px] font-poppins-bold text-neutral-400 mb-1">
                  ABOUT
                </Text>
                <Text className="text-neutral-600 leading-6">
                  {place.description}
                </Text>
              </View>
            )}

            {/* Website CTA */}
            {place.website && (
              <Pressable
                onPress={openWebsite}
                className="bg-[#7454F6] py-3 rounded-xl items-center flex-row justify-center"
              >
                <Text className="text-white font-poppins-bold mr-2">
                  Visit Website
                </Text>
                <Ionicons name="arrow-forward" size={14} color="white" />
              </Pressable>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}