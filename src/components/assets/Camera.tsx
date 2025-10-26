import * as ImagePicker from "expo-image-picker";
import React, { useRef } from "react";
import { Animated, Pressable, StyleProp, ViewStyle } from "react-native";
import Svg, { Path, SvgProps } from "react-native-svg";

type CameraProps = SvgProps & {
  width?: number | string;
  height?: number | string;
  fill?: string;
  style?: StyleProp<ViewStyle>;
  onPick?: (uri: string) => void;
};

const Camera: React.FC<CameraProps> = ({
  width = 28,
  height = 24,
  fill = "black",
  style,
  onPick,
  ...props
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 20,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  };

  const pickImage = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        console.warn("Media library permission not granted");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.9,
        exif: false,
        selectionLimit: 1,
      });
      if (!result.canceled) {
        const uri = result.assets?.[0]?.uri;
        if (uri) onPick?.(uri);
      }
    } catch (e) {
      console.warn("Image picking failed", e);
    }
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPress={pickImage}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
      >
        <Svg width={width} height={height} viewBox="0 0 28 24" {...props}>
          <Path
            d="M10.4346 12.8096C10.4346 11.9103 10.7918 11.0479 11.4277 10.412C12.0636 9.77607 12.9261 9.41882 13.8254 9.41882C14.7247 9.41882 15.5871 9.77607 16.223 10.412C16.8589 11.0479 17.2162 11.9103 17.2162 12.8096C17.2162 13.7089 16.8589 14.5714 16.223 15.2073C15.5871 15.8432 14.7247 16.2004 13.8254 16.2004C12.9261 16.2004 12.0636 15.8432 11.4277 15.2073C10.7918 14.5714 10.4346 13.7089 10.4346 12.8096Z"
            fill={fill}
          />
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.00439 4.73507C7.00399 4.11314 7.1262 3.49723 7.36402 2.92257C7.60183 2.3479 7.9506 1.82576 8.39037 1.38599C8.83014 0.946215 9.35229 0.597448 9.92695 0.359629C10.5016 0.12181 11.1175 -0.000395299 11.7395 9.60586e-07H15.9109C16.5328 -0.000395299 17.1487 0.12181 17.7234 0.359629C18.298 0.597448 18.8202 0.946215 19.26 1.38599C19.6997 1.82576 20.0485 2.3479 20.2863 2.92257C20.5241 3.49723 20.6463 4.11314 20.646 4.73507C20.6462 4.74582 20.6503 4.75613 20.6575 4.76414C20.6647 4.77215 20.6745 4.77734 20.6851 4.77877L24.0458 5.05003C25.5513 5.17361 26.7886 6.28579 27.0704 7.77021C27.786 11.5567 27.839 15.4386 27.2271 19.2432L27.0809 20.1534C26.9468 20.9874 26.5369 21.7523 25.9167 22.3258C25.2965 22.8992 24.5019 23.2481 23.66 23.3167L20.7319 23.5533C16.135 23.9267 11.5154 23.9267 6.91849 23.5533L3.99034 23.3167C3.14822 23.2481 2.35345 22.8989 1.73324 22.3252C1.11302 21.7514 0.703216 20.9862 0.569403 20.1519L0.423222 19.2432C-0.190136 15.4379 -0.135884 11.5574 0.579952 7.77021C0.716828 7.04837 1.08689 6.39143 1.6333 5.90028C2.17971 5.40914 2.87225 5.11096 3.60455 5.05154L6.9652 4.77877C6.97587 4.77734 6.98567 4.77215 6.99285 4.76414C7.00003 4.75613 7.00412 4.74582 7.00439 4.73507ZM13.8252 7.15836C12.3263 7.15836 10.8889 7.75376 9.82907 8.81359C8.76924 9.87342 8.17384 11.3109 8.17384 12.8097C8.17384 14.3085 8.76924 15.746 9.82907 16.8058C10.8889 17.8656 12.3263 18.461 13.8252 18.461C15.324 18.461 16.7614 17.8656 17.8213 16.8058C18.8811 15.746 19.4765 14.3085 19.4765 12.8097C19.4765 11.3109 18.8811 9.87342 17.8213 8.81359C16.7614 7.75376 15.324 7.15836 13.8252 7.15836Z"
            fill={fill}
          />
        </Svg>
      </Pressable>
    </Animated.View>
  );
};

export default React.memo(Camera);
