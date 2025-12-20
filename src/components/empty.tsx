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
  return (
    <SafeAreaView className="flex-1 p-5 bg-white justify-center gap-8">
      <View className="gap-2">
        <Text className="text-2xl font-playfair-semibold text-center">
          {title}
        </Text>
        <Text className="text-base font-poppins-light text-center">
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