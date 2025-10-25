import DateTimePicker from "@react-native-community/datetimepicker";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type InputProps = {
  label?: string;
  placeholder?: string;
  type?: "text" | "email" | "phone" | "password" | "dob" | "number";
  value: string;
  onChangeText: (val: string) => void;
  error?: string;
};

const Input = forwardRef(
  (
    {
      label,
      placeholder,
      type = "text",
      value,
      onChangeText,
      error,
    }: InputProps,
    ref: React.Ref<any>
  ) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const textInputRef = useRef<TextInput | null>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (type === "dob") {
          setShowDatePicker(true);
        } else {
          textInputRef.current?.focus();
        }
      },
      setValue: (val: string) => {
        onChangeText(val);
      },
      clear: () => {
        onChangeText("");
      },
    }));

    const getKeyboardType = () => {
      switch (type) {
        case "email":
          return "email-address";
        case "phone":
          return "phone-pad";
        case "number":
          return Platform.OS === "ios" ? "number-pad" : "numeric";
        default:
          return "default";
      }
    };

    const getTextContentType = () => {
      switch (type) {
        case "email":
          return "emailAddress";
        case "phone":
          return "telephoneNumber";
        case "password":
          return "password";
        default:
          return undefined;
      }
    };

    const isSecure = type === "password";

    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}

        {type === "dob" ? (
          <>
            <Pressable
              style={[styles.input, error && styles.errorBorder]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={value ? styles.valueText : styles.placeholderText}>
                {value || placeholder || "Select Date"}
              </Text>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={value ? new Date(value) : new Date()}
                mode="date"
                display="default"
                onChange={(_, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) onChangeText(selectedDate.toISOString());
                }}
              />
            )}
          </>
        ) : (
          <TextInput
            ref={textInputRef}
            style={[styles.input, error && styles.errorBorder]}
            placeholder={placeholder}
            keyboardType={getKeyboardType()}
            textContentType={getTextContentType()}
            secureTextEntry={isSecure}
            value={value}
            onChangeText={onChangeText}
            autoCapitalize={type === "email" ? "none" : "sentences"}
          />
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }
);

Input.displayName = "Input";

export default Input;

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
    // use parent padding for alignment instead of fixed marginLeft
    fontWeight: "500",
  },
  input: {
    width: "100%",
    backgroundColor: "#E6E6E6",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 6,
    minHeight: 44, // ensures tappable area on small screens
    justifyContent: "center", // centers value/placeholder vertically for pressable DOB
  },
  errorBorder: {
    borderWidth: 1,
    borderColor: "#FF4D4F",
  },
  errorText: {
    color: "#FF4D4F",
    marginTop: 4,
    fontSize: 12,
    // aligns with container padding
  },
  placeholderText: {
    color: "#999",
  },
  valueText: {
    color: "#000",
  },
});
