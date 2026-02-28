import { Option } from "@/api/my-profile/types";
import Checkbox from "expo-checkbox";
import { FC, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import colors from "tailwindcss/colors";

interface Props {
  options: Option[];
  initialSelection: Option[];
  onChange: (selected: Option[]) => void;
}

export const CheckboxList: FC<Props> = ({
  options,
  initialSelection,
  onChange,
}) => {
  const [selected, setSelected] = useState<Option[]>(initialSelection);

  const toggleSelection = (option: Option) => {
    const updatedSelection = selected.some((i) => i.id === option.id)
      ? selected.filter((i) => i.id !== option.id)
      : [...selected, option];

    setSelected(updatedSelection);
    onChange(updatedSelection);
  };

  return (
    <FlatList
      data={options}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.id.toString()}
      ItemSeparatorComponent={() => (
        <View className="h-px bg-neutral-200/60" />
      )}
      renderItem={({ item }) => {
        const isChecked = selected.some((s) => s.id === item.id);

        return (
          <Pressable
            onPress={() => toggleSelection(item)}
            className="flex-row justify-between items-center py-4"
            android_ripple={{ color: "#e5e5e5" }}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text className="text-base font-poppins-regular text-[#1A1A1A]">
              {item.name}
            </Text>

            {/* Improved Checkbox */}
            <View
              style={{
                height: 22,
                width: 22,
                borderRadius: 6,
                borderWidth: isChecked ? 2 : 1.4,
                borderColor: isChecked ? "#000" : "#BDBDBD",
                backgroundColor: isChecked ? "#FFF" : "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isChecked && (
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#000",
                    marginTop: -1,
                  }}
                >
                  ✓
                </Text>
              )}
            </View>
          </Pressable>
        );
      }}
    />
  );
};
