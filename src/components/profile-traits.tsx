import { Profile } from "@/types/profile";
import { FC } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  profile: Profile;
}

export const ProfileTraits: FC<Props> = ({ profile }) => {
  const traits = profile?.traits || [];

  return (
    <View
      style={{
        backgroundColor: "rgba(250,248,255,0.7)", // soft glass + purple tint
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 10,
        shadowColor: "#5A3FE3",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { height: 2 },
      }}
    >
      <View className="flex-row flex-wrap justify-between">
        {traits.map(({ key, icon, label }) => {
          if (!label) return null;

          return (
            <View
              key={key}
              style={{
                width: "31%", // 3 columns
                backgroundColor: "rgba(255,255,255,0.75)",
                borderRadius: 14,
                marginBottom: 12,
                paddingVertical: 12,
                paddingHorizontal: 10,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#5A3FE3",
                shadowOpacity: 0.04,
                shadowRadius: 5,
              }}
            >
              <Ionicons
                name={icon as keyof typeof Ionicons.glyphMap}
                size={22}
                color="#6B57F5"
                style={{ marginBottom: 4 }}
              />

              <Text className="text-center text-[13px] font-poppins-medium text-[#3A3A3A]">
                {label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};
