import { Option } from "@/api/my-profile/types";
import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import colors from "tailwindcss/colors";

interface Props {
  options: Option[];
  initialSelection: Option | null;
  onChange: (selected: Option | null) => void;
}

export const RadioList: React.FC<Props> = ({
  options,
  initialSelection,
  onChange,
}) => {
  const [selected, setSelected] = useState<Option | null>(initialSelection);

  const handleSelection = (item: Option) => {
    const updatedSelection = selected?.id === item.id ? null : item;

    setSelected(updatedSelection);
    onChange(updatedSelection);
  };

  return (
    <FlatList
      data={options}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.id.toString()}
      ItemSeparatorComponent={() => <View className="h-px bg-neutral-200" />}
      renderItem={({ item }) => {
        const isChecked = selected?.id === item.id;

        return (
          <Pressable
            className="py-5 flex-row justify-between"
            onPress={() => handleSelection(item)}
          >
            <Text className="text-base font-poppins-regular">{item.name}</Text>
            <Checkbox
              value={isChecked}
              color={isChecked ? colors.fuchsia[950] : colors.neutral[400]}
              className="h-5 w-5"
              pointerEvents="none"
            />
          </Pressable>
        );
      }}
    />
  );
};