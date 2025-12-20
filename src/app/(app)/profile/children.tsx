import { PrivateProfile } from "@/api/my-profile/types";
import { useChildren } from "@/api/options";
import { StackHeaderV4 } from "@/components/stack-header-v4";
import { useEdit } from "@/store/edit";
import { router } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";

interface OptionType {
  id: number;
  name: string;
}

export default function Page() {
  const { edits, setEdits } = useEdit();
  const { data } = useChildren(); // returns OptionType[]
  const [selected, setSelected] = useState<OptionType | null>(
    edits?.children || null
  );

  const handlePress = () => {
    if (selected) {
      setEdits({
        ...edits,
        children: selected,
      } as PrivateProfile);
    }
    router.back();
  };

  return (
    <View className="flex-1 bg-white p-5">
      <StackHeaderV4 title="Children" onPressBack={handlePress} />

      {/* Instructions */}
      <View className="mb-5 mt-2">
        <Text className="text-sm font-poppins-regular text-[#6A6A6A]">
          Select an option that represents you best.
        </Text>
        <Text className="text-sm font-poppins-regular text-[#7454F6] mt-1">
          Your preference helps us match better connections.
        </Text>
      </View>

      {/* iOS Card wrapper */}
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 10,
          borderRadius: 18,
          backgroundColor: "#F8F8FA",
          borderWidth: 1,
          borderColor: "#EAE4FF",
          shadowColor: "#7454F6",
          shadowOpacity: 0.06,
          shadowRadius: 6,
        }}
      >
        <CustomRadioList
          options={data || []}
          onChange={setSelected}
          initialSelection={selected}
        />
      </View>
    </View>
  );
}

/* ---------------------------------------------
   TYPES FOR CUSTOM RADIO COMPONENTS
---------------------------------------------- */

interface CustomRadioListProps {
  options: OptionType[];
  onChange: (opt: OptionType) => void;
  initialSelection: OptionType | null;
}

const CustomRadioList = ({
  options,
  onChange,
  initialSelection,
}: CustomRadioListProps) => {
  return (
    <View>
      {options.map((opt: OptionType, index: number) => (
        <RadioItem
          key={opt.id}
          option={opt}
          onPress={() => onChange(opt)}
          selected={initialSelection?.id === opt.id}
          isLast={index === options.length - 1}
        />
      ))}
    </View>
  );
};

interface RadioItemProps {
  option: OptionType;
  selected: boolean;
  onPress: () => void;
  isLast: boolean;
}

const RadioItem = ({
  option,
  selected,
  onPress,
  isLast,
}: RadioItemProps) => {
  const scaleAnim = new Animated.Value(1);

  const animatePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.96,
      duration: 90,
      easing: Easing.out(Easing.circle),
      useNativeDriver: true,
    }).start();
  };

  const animatePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 90,
      easing: Easing.out(Easing.circle),
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPressIn={animatePressIn}
        onPressOut={animatePressOut}
        onPress={onPress}
        style={[styles.row, !isLast && styles.borderBottom]}
      >
        <Text style={styles.label}>{option.name}</Text>

        <View
          style={[
            styles.outerRing,
            selected && styles.outerRingSelected,
          ]}
        >
          {selected && <View style={styles.innerDot} />}
        </View>
      </Pressable>
    </Animated.View>
  );
};

/* ---------------------------------------------
   STYLES
---------------------------------------------- */

const styles = StyleSheet.create({
  row: {
    paddingVertical: 16,
    paddingHorizontal: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderColor: "#EDEDED",
  },
  label: {
    fontSize: 16,
    color: "#1A1A1A",
    fontFamily: "Poppins-Regular",
  },
  outerRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#C8B8FF",
    justifyContent: "center",
    alignItems: "center",
  },
  outerRingSelected: {
    borderColor: "#7454F6",
    shadowColor: "#7454F6",
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  innerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#7454F6",
  },
});
