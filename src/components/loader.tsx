import LottieView from "lottie-react-native";
import { FC } from "react";
import { View } from "react-native";

interface Props {
  width?: number;
  height?: number;
}

export const Loader: FC<Props> = ({ width = 200, height = 200 }) => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <LottieView
        autoPlay
        // @ts-ignore
        className="w-full h-full bg-white mt-12"
        style={{
          width,
          height,
        }}
        source={require("~/assets/images/loading.json")}
      />
    </View>
  );
};
