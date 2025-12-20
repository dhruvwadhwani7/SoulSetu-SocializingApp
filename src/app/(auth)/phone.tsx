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

      {/* Floating doodles */}
      <View className="absolute top-0 right-0 w-36 h-36 bg-[#FFE8F0] rounded-full opacity-40 blur-2xl" />
      <View className="absolute -top-8 -left-8 w-40 h-40 bg-[#E8F5FF] rounded-full opacity-40 blur-xl" />
      <View className="absolute bottom-20 -right-10 w-44 h-44 bg-[#F2FFE8] rounded-full opacity-40 blur-2xl" />

      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          phoneRef.current?.blur();
        }}
        accessible={false}
      >
        <View className="flex-1 justify-center pt-20">

          {/* Title */}
          <Text className="text-[32px] font-poppins-semibold text-[#0A0A0A] text-center leading-tight">
            Enter Your{" "}
            <Text className="text-[#7454F6]">Phone</Text> Number
          </Text>

          <Text className="text-center text-[#6B6B6B] mt-3 font-poppins-regular">
            We'll send you a verification code
          </Text>

          <View className="h-20" />

          {/* Phone Input */}
          <View className="relative px-4">
            <TextInput
              className="rounded-2xl h-16 text-3xl font-poppins-semibold bg-[#EFEFEF] px-5"
              style={
                Platform.OS === "ios" ? { lineHeight: undefined } : undefined
              }
              placeholder=""
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
                className="absolute left-7 top-0 bottom-0 justify-center"
              >
                <Text className="text-base text-neutral-500 font-poppins-regular">
                  +1 234 567 8900
                </Text>
              </View>
            )}
          </View>

          {/* Error message */}
          {isError && (
            <Text className="text-red-500 text-sm text-center mt-4 font-poppins-regular">
              {error.message}
            </Text>
          )}

          {/* FAB Button */}
          <View className="items-end mt-10 pr-2">
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
