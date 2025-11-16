import { PrivateProfile } from "@/api/my-profile/types";
import { cn } from "@/utils/cn";
import { Ionicons } from "@expo/vector-icons";
import { Href, Link } from "expo-router";
import { FC } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

interface Props {
  data: {
    title: string;
    getValue: (profile: PrivateProfile) => string;
    route: string;
  }[];
  title: string;
  profile: PrivateProfile;
}

export const List: FC<Props> = ({ title, data, profile }) => {
  return (
    <FlatList
      scrollEnabled={false}
      data={data}
      keyExtractor={(item) => item.title}
      ListHeaderComponent={() => {
        return (
          <Text className="text-[17px] font-poppins-semibold text-[#1A1A1A] mb-3 px-1">
            {title}
          </Text>
        );
      }}
      renderItem={({ item, index }) => {
        const isLast = index === data.length - 1;

        return (
          <View
            className={cn(
              "bg-white rounded-xl overflow-hidden",
              index === 0 && "mt-1"
            )}
          >
            <Link href={item.route as Href} asChild>
              <Pressable
                className={cn(
                  "flex-row items-center justify-between px-4 py-4",
                  !isLast && "border-b border-neutral-200"
                )}
                android_ripple={{ color: "#EDEDED" }}
              >
                {/* Text Block */}
                <View className="flex-1">
                  <Text
                    className={cn(
                      "text-[15px] font-poppins-medium text-[#2A2A2A] tracking-wide",
                      {
                        "text-[#C62828]":
                          ["Name", "Age", "Location", "Gender"].includes(
                            item.title
                          ) && item.getValue(profile) === "None",
                      }
                    )}
                  >
                    {item.title}
                  </Text>

                  <Text
                    className={cn(
                      "text-[14px] mt-0.5 font-poppins-light text-[#6F6F6F]",
                      {
                        "text-[#C62828]":
                          ["Name", "Age", "Location", "Gender"].includes(
                            item.title
                          ) && item.getValue(profile) === "None",
                      }
                    )}
                  >
                    {item.getValue(profile!)}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color="#B5B5B5"
                  style={{ marginLeft: 8 }}
                />
              </Pressable>
            </Link>
          </View>
        );
      }}
    />
  );
};
