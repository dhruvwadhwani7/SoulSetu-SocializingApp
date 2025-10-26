import React, { forwardRef, useImperativeHandle } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type SelectInputProps = {
  label?: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  error?: string;
};

const SelectInput = forwardRef(
  (
    { label, options = [], value, onChange, error }: SelectInputProps,
    ref: React.Ref<any>
  ) => {
    useImperativeHandle(ref, () => ({
      focus: () => {
        // pragmatic: if nothing selected, select first option when focusing
        if (!value && options.length) {
          onChange(options[0]);
        }
      },
      setValue: (val: string) => {
        onChange(val);
      },
      clear: () => {
        onChange("");
      },
    }));

    return (
      <View style={styles.container}>
        {label ? <Text style={styles.label}>{label}</Text> : null}

        <View style={styles.optionsRow}>
          {options.map((opt) => {
            const isActive = value === opt;
            return (
              <Pressable
                key={opt}
                onPress={() => onChange(opt)}
                style={[styles.option, isActive && styles.activeOption]}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
              >
                <Text
                  style={[
                    styles.optionText,
                    isActive && styles.activeOptionText,
                  ]}
                >
                  {opt}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }
);

SelectInput.displayName = "SelectInput";

export default SelectInput;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 23,
    marginBottom: 8,
  },
  label: {
    color: "#050505",
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 1, // RN 0.71+ supports gap; if older RN remove and add margin to option
  },
  option: {
    backgroundColor: "#E6E6E6", // same as Input input background
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 25,
    minHeight: 44,
    justifyContent: "center",
    marginRight: 8, // fallback spacing if gap unsupported
    marginBottom: 6,
  },
  optionText: {
    color: "#000",
    fontSize: 14,
  },
  activeOption: {
    backgroundColor: "#bebebe", // active visual; you can tweak
    borderWidth: 1,
    borderColor: "#000000",
  },
  activeOptionText: {
    color: "#000",
    fontWeight: "600",
  },
  errorText: {
    color: "#FF4D4F",
    marginTop: 4,
    fontSize: 12,
  },
});
