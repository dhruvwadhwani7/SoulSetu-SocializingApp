import { Photo } from "@/types/profile";
import { Image } from "expo-image";
import { FC } from "react";
import { View } from "react-native";

interface Props {
  photo: Photo;
}

export const ProfilePhoto: FC<Props> = ({ photo }) => {
  return (
    <View
      style={{
        width: "100%",
        aspectRatio: 1,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: "rgba(240,240,255,0.5)", // soft light-purple tint
        shadowColor: "#7454F6",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      }}
    >
      <Image
        source={photo.photo_url}
        contentFit="cover"
        transition={250} // smoother fade-in
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          backgroundColor: "#E6E2F5", // smooth purple-gray fallback
        }}
      />
    </View>
  );
};
