import { View, Text, Pressable } from "react-native";

export type PlaceType = "cafe" | "restaurant" | "park";

type Props = {
  selected: PlaceType;
  onChange: (type: PlaceType) => void;
};

const TYPES: { key: PlaceType; label: string; emoji: string }[] = [
  { key: "cafe", label: "Cafés", emoji: "" },
  { key: "restaurant", label: "Restaurants", emoji: "" },
  { key: "park", label: "Parks", emoji: "" },
];

export default function PlaceTypeFilter({ selected, onChange }: Props) {
  return (
    <View className="px-5 pb-3">
      <Text className="text-[13px] font-poppins-semibold mb-2">
        Filter places
      </Text>

      <View className="flex-row gap-2">
        {TYPES.map((t) => {
          const active = selected === t.key;

          return (
            <Pressable
              key={t.key}
              onPress={() => onChange(t.key)}
              className={`px-3 py-1.5 rounded-full border ${
                active
                  ? "bg-[#7454F6] border-[#7454F6]"
                  : "bg-white border-neutral-300"
              }`}
            >
              <Text
                className={`text-[12px] ${
                  active ? "text-white" : "text-neutral-700"
                }`}
              >
                {t.emoji} {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}