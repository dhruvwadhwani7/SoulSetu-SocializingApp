import { Photo } from "@/types/profile";
import { Image } from "expo-image";
import { FC } from "react";
import { View } from "react-native";

interface Props {
  photo: Photo;
}

export const ProfilePhoto: FC<Props> = ({ photo }) => {
  return (
    <View className="w-full aspect-square rounded-md overflow-hidden ">
      <Image
        source={photo.photo_url}
        className="flex-1 w-full bg-neutral-200"
      />
    </View>
  );
};