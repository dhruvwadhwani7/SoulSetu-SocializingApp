import { Like } from "@/api/profiles/types";
import { Image } from "expo-image";
import { FC } from "react";
import { Text, View } from "react-native";

interface Props {
  like: Like;
}

export const LikeCard: FC<Props> = ({ like: { photo_url, profile } }) => {
  return (
    <View
      className="
        flex-1
        rounded-[28px]
        bg-[#FAFAFF]
        overflow-hidden
        border border-[#ECEBFF]
      "
      style={{
        shadowColor: "#5A3FE3",
        shadowOpacity: 0.14,
        shadowRadius: 18,
        elevation: 4,
      }}
    >
      {/* IMAGE */}
      <View className="aspect-square w-full overflow-hidden">
        <Image
          source={profile.photos?.[0]?.photo_url}
          className="flex-1"
          contentFit="cover"
        />
      </View>

      {/* INFO */}
      <View className="px-4 py-4">
        <Text className="text-[18px] font-poppins-medium text-[#111]">
          {profile.first_name}
        </Text>

        <Text className="text-[12px] text-neutral-500 mt-1">
          Interested in your {photo_url ? "photo" : "answer"}
        </Text>
      </View>
    </View>
  );
};
