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
        bg-white flex-1 rounded-2xl overflow-hidden 
        border border-neutral-200 
        shadow-sm
      "
    >
      {/* Text Section */}
      <View className="p-4 gap-2">
        <Text className="text-sm text-neutral-600 font-poppins-light">
          {`Liked your ${photo_url ? "photo" : "answer"}`}
        </Text>

        <Text className="text-lg font-poppins-medium text-neutral-900">
          {profile.first_name}
        </Text>
      </View>

      {/* Photo */}
      <View className="bg-neutral-200 aspect-square w-full overflow-hidden rounded-xl m-3">
        <Image
          source={profile.photos[0].photo_url}
          className="flex-1 w-full"
        />
      </View>
    </View>
  );
};
