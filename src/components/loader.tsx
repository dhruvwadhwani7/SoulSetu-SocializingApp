import LottieView from "lottie-react-native";
import { FC } from "react";
import { View } from "react-native";

interface Props {}

export const Loader: FC<Props> = () => {
  return (
    <View className="flex-1 bg-white">
      <LottieView
        autoPlay
        // @ts-ignore
        className="w-full h-full bg-white mt-12"
        source={require("~/assets/images/loading.json")}
      />
    </View>
  );
};