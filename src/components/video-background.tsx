import { useVideoPlayer, VideoSource, VideoView } from "expo-video";
import { FC } from "react";
import { View } from "react-native";

interface Props {
  source: VideoSource;
  children?: React.ReactNode;
}

export const VideoBackground: FC<Props> = ({ source, children }) => {
  const player = useVideoPlayer(source, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <View className="flex-1">
      <View className="absolute top-0 right-0 bottom-0 left-0">
        <VideoView className="flex-1" player={player} contentFit="cover" />
        <View className="absolute top-0 right-0 bottom-0 left-0">
          {children}
        </View>
      </View>
    </View>
  );
};
