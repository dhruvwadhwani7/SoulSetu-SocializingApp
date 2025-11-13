import { Answer, Photo } from "@/types/profile";
import { FC, ReactNode } from "react";
import { View } from "react-native";
import { Fab } from "./fab";

interface Props {
  children: ReactNode;
  item: Photo | Answer;
  type: "photo" | "answer";
  onLike?: (id: string, type: "photo" | "answer") => void;
}

export const ProfileItem: FC<Props> = ({ children, item, type, onLike }) => {
  return (
    <View>
      {children}
      {onLike && (
        <Fab
          className="absolute bottom-5 right-5 bg-white shadow-sm"
          iconName="heart-outline"
          iconClassName="text-fuchsia-900 text-4xl"
          onPress={() => onLike(item.id, type)}
        />
      )}
    </View>
  );
};