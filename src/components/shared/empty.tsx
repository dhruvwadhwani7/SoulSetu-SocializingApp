import { isError } from "lodash";
import { FC } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  title: string;
  subTitle: string;
  primaryText?: string;
  secondaryText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
}

export const Empty: FC<Props> = ({
  title,
  subTitle,
  onPrimaryPress,
  onSecondaryPress,
  primaryText,
  secondaryText,
}) => {
  const isError = title.toLowerCase().includes("wrong");
  return (
    <SafeAreaView className="flex-1 p-5 bg-white justify-center gap-8 px-8">
      <View
        className="gap-2 rounded-3xl px-6 py-10 items-centre"
        style={{
          borderWidth: 3,
          borderColor: isError
            ? "rgba(239,68,68,0.25)"
            : "rgba(116,84,246,0.2)",
          backgroundColor: "#FFFFFF",
          shadowColor: "#7454F6",
          shadowOpacity: 0.15,
          shadowRadius: 10,
          elevation: 3,
        }}
      >
        <Text className="text-2xl  text-[20px] font-poppins-semibold text-center mb-2"
        style = {{
          color : isError ? "#B91C1C" : "#111"
        }}>
          {title}
        </Text>
        <Text className="text-base text-[14px] text-neutral-500 font-poppins-light  text-center">
          {subTitle}
        </Text>
      </View>
      <View className="gap-2 px-5">
        {primaryText && (
          <Pressable
            className="h-14 bg-black items-center justify-center rounded-full w-full"
            onPress={onPrimaryPress}
          >
            <Text className="text-white text-base font-poppins-medium">
              {primaryText}
            </Text>
          </Pressable>
        )}
        {secondaryText && (
          <Pressable
            className="h-14 bg-white items-center justify-center rounded-full border border-neutral-400"
            onPress={onSecondaryPress}
          >
            <Text className="text-black text-base font-poppins-medium ">
              {secondaryText}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};
