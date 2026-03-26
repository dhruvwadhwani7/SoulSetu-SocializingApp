import { View, Text } from "react-native";
import { Slider } from "@miblanchard/react-native-slider";

type Props = {
  value: number;
  onChange: (v: number) => void;
  loading?: boolean;
};

export default function RadiusSelector({ value, onChange, loading }: Props) {
  return (
    <View className="px-5 pb-3">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-[13px] font-poppins-semibold">
          Radius: {value} km
        </Text>

        {loading && (
          <Text className="text-[11px] text-[#7454F6] font-poppins-medium">
            Updating…
          </Text>
        )}
      </View>

      <Slider
        value={value}
        minimumValue={1}
        maximumValue={20}
        step={1}
        onValueChange={(v) => onChange(v[0])}
        minimumTrackTintColor="#7454F6"
        maximumTrackTintColor="#E9E5FF"
        thumbTintColor="#7454F6"
        trackStyle={{ height: 4, borderRadius: 2 }}
        thumbStyle={{ width: 18, height: 18 }}
      />
    </View>
  );
}