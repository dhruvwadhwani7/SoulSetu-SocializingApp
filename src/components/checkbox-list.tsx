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
    const updatedSelection = selected.some((item) => item.id === option.id)
      ? selected.filter((item) => item.id !== option.id)
      : [...selected, option];
    setSelected(updatedSelection);
    onChange(updatedSelection);
  };

  return (
    <FlatList
      data={options}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.id.toString()}
      ItemSeparatorComponent={() => <View className="h-px  bg-neutral-200" />}
      renderItem={({ item }) => {
        const isChecked = selected.some((s) => s.id === item.id);
        return (
          <Pressable
            className="flex-row justify-between py-5"
            onPress={() => toggleSelection(item)}
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