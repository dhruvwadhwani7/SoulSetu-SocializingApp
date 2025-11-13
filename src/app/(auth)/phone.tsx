import { useSignInWithOtp } from "@/api/auth";
import { Fab } from "@/components/fab";
import { StackHeader } from "@/components/stack-header";
import { router, useFocusEffect } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import colors from "tailwindcss/colors";

export default function Page() {
  const [phone, setPhone] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const phoneRef = useRef<TextInput>(null);
  const {
    mutate: signInWithOtp,
    isPending,
    isError,
    error,
    reset,
  } = useSignInWithOtp();

  const handlePhoneChange = (text: string) => {
    if (isError) {
      reset();
    }
    setPhone(text);
  };

  const isValid = useMemo(() => {
    return /^\+[1-9]\d{1,14}$/.test(phone);
  }, [phone]);

  const handleSubmit = () => {
    signInWithOtp(phone, {
      onSuccess: () =>
        router.push({
          pathname: "/otp",
          params: { phone },
        }),
    });
  };

  useFocusEffect(() => {
    phoneRef.current?.focus();
  });

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white p-5"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <StackHeader />
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          phoneRef.current?.blur();
        }}
        accessible={false}
      >
        <View className="flex-1 justify-center pt-28">
          <View className="flex-1">
            <Text className="text-3xl font-poppins-medium">
              Enter Your Phone Number
            </Text>
            <View className="h-28" />
            <View className="relative">
              <TextInput
                className="pl-5 rounded-[10px] h-16 text-4xl font-poppins-semibold bg-[#E7E7E7]"
                style={
                  Platform.OS === "ios" ? { lineHeight: undefined } : undefined
                }
                placeholder="" // native placeholder disabled; using custom overlay so native styling doesn't interfere
                selectionColor={colors.black}
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                autoFocus={true}
                value={phone}
                onChangeText={handlePhoneChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                maxLength={16}
                ref={phoneRef}
              />
              {!phone && !isFocused && (
                <View
                  pointerEvents="none"
                  className="absolute left-4 top-0 bottom-0 justify-center"
                >
                  <Text className="text-sm text-neutral-500">
                    Your Phone Number
                  </Text>
                </View>
              )}
            </View>

            {isError && (
              <Text className="text-red-500 text-sm text-center mt-4">
                {error.message}
              </Text>
            )}
          </View>
          <View className="items-end">
            <Fab
              disabled={!isValid || isPending}
              onPress={handleSubmit}
              loading={isPending}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
