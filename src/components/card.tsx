import React, { FC, ReactNode, forwardRef } from "react";
import { Pressable, PressableProps, Text, View } from "react-native";

interface Props extends PressableProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
}

export const Card: FC<Props> = forwardRef<View, Props>(
  ({ icon, title, subtitle, ...rest }, ref) => {
    return (
      <Pressable
        ref={ref}
        {...rest}
        className="flex-row items-center gap-4 border border-neutral-300 rounded-md p-3"
      >
        <View className="bg-zinc-300 h-12 aspect-square rounded-full items-center justify-center">
          {icon}
        </View>
        <View>
          <Text className="text-base font-poppins-medium">{title}</Text>
          <Text className="text-sm font-poppins-light">{subtitle}</Text>
        </View>
      </Pressable>
    );
  }
);

Card.displayName = "Card";