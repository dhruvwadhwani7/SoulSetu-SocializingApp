import { useSignInWithOtp } from "@/api/auth";
import { Fab } from "@/components/shared/fab";
import { StackHeader } from "@/components/shared/stack-header";
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
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import colors from "tailwindcss/colors";

export default function Page() {
  /* ================= STATE ================= */
  const [countryCode, setCountryCode] = useState("+1");
  const [country, setCountry] = useState<CountryCode>("US");
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

  /* ================= DERIVED ================= */
  const fullPhone = `${countryCode}${phone}`;

  const isValid = useMemo(() => {
    // E.164 validation
    return /^\+[1-9]\d{7,14}$/.test(fullPhone);
  }, [fullPhone]);

  /* ================= HANDLERS ================= */
  const handlePhoneChange = (text: string) => {
    if (isError) reset();
    setPhone(text.replace(/\D/g, ""));
  };

  const handleSubmit = () => {
    signInWithOtp(fullPhone, {
      onSuccess: () =>
        router.push({
          pathname: "/otp",
          params: { phone: fullPhone },
        }),
    });
  };

  useFocusEffect(() => {
    phoneRef.current?.focus();
  });

  /* ================= UI ================= */
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white px-6"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={120}
    >
      <StackHeader />

      {/* ===== Background Wash ===== */}
      <View className="absolute -top-20 -right-20 w-72 h-72 bg-[#EFE9FF] rounded-full blur-3xl opacity-40" />
      <View className="absolute top-24 -left-24 w-80 h-80 bg-[#EAF2FF] rounded-full blur-3xl opacity-35" />
      <View className="absolute bottom-24 right-[-80] w-96 h-96 bg-[#F3FFE8] rounded-full blur-3xl opacity-30" />

      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          phoneRef.current?.blur();
        }}
        accessible={false}
      >
        <View className="flex-1 justify-center">
          {/* ===== Heading ===== */}
          <Text className="text-[30px] font-poppins-semibold text-[#0A0A0A] text-center leading-tight">
            Enter your <Text className="text-[#7454F6]">phone number</Text>
          </Text>

          <Text className="text-center text-[#6A6A6A] mt-3 font-poppins-regular text-base">
            We’ll send you a one-time verification code
          </Text>

          <View className="h-14" />

          {/* ===== Phone Input with Country Picker ===== */}
          <View>
            <View className="flex-row items-center gap-2">
              {/* Country Picker */}
              <View className="h-[58px] px-2 rounded-xl bg-[#F3F3F3] flex-row items-center">
                <CountryPicker
                  countryCode={country}
                  withFlag
                  withCallingCode
                  withFilter
                  onSelect={(c: Country) => {
                    setCountry(c.cca2 as CountryCode);
                    setCountryCode(`+${c.callingCode[0]}`);
                    phoneRef.current?.focus();
                  }}
                />
                {/* Dropdown indicator */}
              </View>
              <Text className="ml-2 font-poppins-semibold text-base text-[#111]">
                {countryCode}
              </Text>

              {/* Phone Input */}
              <TextInput
                ref={phoneRef}
                className="flex-1 h-[58px] rounded-xl bg-[#F3F3F3] px-5 text-[20px] font-poppins-semibold text-[#111]"
                style={
                  Platform.OS === "ios" ? { lineHeight: undefined } : undefined
                }
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                selectionColor={colors.black}
                value={phone}
                onChangeText={handlePhoneChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                maxLength={12}
              />
            </View>

            {/* Helper text */}
            <View className="mt-5 px-3 py-2 rounded-xl bg-[#F6F4FF] self-start">
              <Text className="text-xs text-[#7454F6] font-poppins-medium">
                Tap the country flag to change
              </Text>
            </View>
          </View>

          {/* ===== Error ===== */}
          {isError && (
            <View className="mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 flex-row items-start gap-3">
              <View className="w-2 h-2 rounded-full bg-red-400 mt-2" />
              <Text className="flex-1 text-red-600 text-sm font-poppins-regular leading-relaxed">
                {error.message}
              </Text>
            </View>
          )}

          {/* ===== CTA ===== */}
          <View className="items-end mt-10 pr-1">
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
