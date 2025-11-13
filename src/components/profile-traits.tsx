import { Profile } from "@/types/profile";
import { cn } from "@/utils/cn";
import { Ionicons } from "@expo/vector-icons";
import { FC } from "react";
import { ScrollView, Text, View } from "react-native";

interface Props {
  profile: Profile;
}

export const ProfileTraits: FC<Props> = ({ profile }) => {
  return (
    <View className="bg-white border border-neutral-200 rounded-lg">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {profile?.traits.map(({ key, icon, label }, index) => {
          if (!label) return null;
          return (
            <View key={key} className="py-2">
              <View
                className={cn(
                  "flex-row items-center gap-2 px-5 py-2  border-gray-300",
                  { "border-r-[0.25px]": index !== profile.traits.length - 1 }
                )}
              >
                <Ionicons
                  name={icon as keyof typeof Ionicons.glyphMap}
                  className="text-2xl"
                />
                <Text>{label}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};