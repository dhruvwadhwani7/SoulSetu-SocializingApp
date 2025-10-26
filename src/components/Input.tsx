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
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

type InputProps = {
  label?: string;
  placeholder?: string;
  type?: "text" | "email" | "phone" | "password" | "dob" | "number";
  value: string;
  onChangeText: (val: string) => void;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  containerStyle?: StyleProp<ViewStyle>;
  inputTextStyle?: StyleProp<TextStyle>;
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
      multiline = false,
      numberOfLines,
      containerStyle,
      inputTextStyle,
    }: InputProps,
    ref: React.Ref<any>
  ) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const textInputRef = useRef<TextInput | null>(null);

    // helper: pad single digit numbers
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

    // format Date -> "dd-mm-yyyy"
    const formatDate = (d: Date) =>
      `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;

    // parse "dd-mm-yyyy" or fallback to Date(value) if possible; returns a valid Date
    const parseDateFromString = (s?: string) => {
      if (!s) return new Date();
      const dmY = s.trim();
      const parts = dmY.split("-");
      if (parts.length === 3) {
        const dd = parseInt(parts[0], 10);
        const mm = parseInt(parts[1], 10);
        const yyyy = parseInt(parts[2], 10);
        if (!Number.isNaN(dd) && !Number.isNaN(mm) && !Number.isNaN(yyyy)) {
          return new Date(yyyy, mm - 1, dd);
        }
      }
      // fallback: try Date constructor (handles ISO etc.)
      const fallback = new Date(s);
      return isNaN(fallback.getTime()) ? new Date() : fallback;
    };

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
              style={[
                styles.input,
                error && styles.errorBorder,
                containerStyle,
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={value ? styles.valueText : styles.placeholderText}>
                {value || placeholder || "Select Date"}
              </Text>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={parseDateFromString(value)}
                mode="date"
                display="default"
                onChange={(_, selectedDate) => {
                  // close picker (Android will dismiss; iOS might keep open depending on implementation)
                  setShowDatePicker(false);
                  if (selectedDate) {
                    // emit date as dd-mm-yyyy (no time)
                    onChangeText(formatDate(selectedDate));
                  }
                }}
              />
            )}
          </>
        ) : (
          <View
            style={[
              styles.input,
              multiline && styles.textarea,
              error && styles.errorBorder,
              containerStyle,
            ]}
          >
            <TextInput
              ref={textInputRef}
              style={[styles.textInput, inputTextStyle]}
              placeholder={placeholder}
              keyboardType={getKeyboardType()}
              textContentType={getTextContentType()}
              secureTextEntry={isSecure}
              value={value}
              onChangeText={onChangeText}
              autoCapitalize={type === "email" ? "none" : "sentences"}
              multiline={multiline}
              numberOfLines={multiline ? (numberOfLines ?? 5) : 1}
              textAlignVertical={
                multiline ? ("top" as const) : ("center" as const)
              }
            />
          </View>
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
  textarea: {
    minHeight: 120,
    paddingTop: 12,
    paddingBottom: 12,
  },
  textInput: {
    padding: 0,
    margin: 0,
    flexGrow: 1,
    color: "#000",
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
