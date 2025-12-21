import { useVerifyOtp } from "@/api/auth";
import { Fab } from "@/components/fab";
import { StackHeader } from "@/components/stack-header";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import colors from "tailwindcss/colors";

export default function Page() {
  const [otp, setOtp] = useState("");
  const otpRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const {
    mutate: verifyOtp,
    isPending,
    isError,
    error,
    reset,
  } = useVerifyOtp();

  const handleOtpChange = (text: string) => {
    if (isError) reset();
    setOtp(text);
  };

  const isValid = useMemo(() => otp.length === 6, [otp]);

  const handleSubmit = () => {
    verifyOtp({ phone, token: otp });
  };

  useEffect(() => {
    if (isFocused && otp.length < 6) {
      loopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0,
            duration: 450,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 450,
            useNativeDriver: true,
          }),
        ])
      );
      loopRef.current.start();
    } else {
      loopRef.current?.stop();
      blinkAnim.setValue(1);
    }
    return () => loopRef.current?.stop();
  }, [isFocused, otp.length, blinkAnim]);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white px-6"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 140 : 80}
    >
      <StackHeader />

      {/* ===== Background Wash ===== */}
      <View className="absolute -top-24 -right-24 w-72 h-72 bg-[#EFE9FF] rounded-full blur-3xl opacity-40" />
      <View className="absolute top-32 -left-28 w-80 h-80 bg-[#EAF2FF] rounded-full blur-3xl opacity-35" />
      <View className="absolute bottom-[-120] right-[-80] w-96 h-96 bg-[#F3FFE8] rounded-full blur-3xl opacity-30" />

      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          otpRef.current?.blur();
        }}
        accessible={false}
      >
        <View className="flex-1 justify-start pt-10">
          {/* ===== Title ===== */}
          <Text className="text-[28px] font-poppins-semibold text-[#0A0A0A] text-center leading-snug px-6">
            Enter your
            <Text className="text-[#7454F6]"> verification </Text>
            code
          </Text>

          {/* ===== Subtitle ===== */}
          <Text className="text-center text-[#6B6B6B] mt-2 font-poppins-regular px-8">
            Sent to <Text className="text-[#4A4A4A]">{phone}</Text>
          </Text>

          <View className="h-12" />

          {/* ===== OTP Boxes ===== */}
          <Pressable
            onPress={() => otpRef.current?.focus()}
            className="flex-row gap-3 justify-center px-2"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <View
                key={index}
                className="flex-1 h-[56px] rounded-xl bg-white items-center justify-center"
                style={{
                  borderWidth: 1,
                  borderColor:
                    isFocused && otp.length === index ? "#BBA7FF" : "#E3E3E3",
                }}
              >
                <Text className="text-[22px] font-poppins-semibold text-[#111]">
                  {otp[index] || ""}
                </Text>

                {/* Blinking Cursor */}
                {isFocused && otp.length === index && otp.length < 6 && (
                  <Animated.View
                    style={{
                      position: "absolute",
                      width: 2,
                      height: 28,
                      backgroundColor: "#7454F6",
                      opacity: blinkAnim,
                      borderRadius: 1,
                      bottom: 10,
                    }}
                  />
                )}
              </View>
            ))}
          </Pressable>

          {/* ===== Hidden Input ===== */}
          <TextInput
            ref={otpRef}
            className="absolute h-1 w-1 opacity-0"
            style={
              Platform.OS === "ios" ? { lineHeight: undefined } : undefined
            }
            selectionColor={colors.black}
            keyboardType="numeric"
            textContentType="oneTimeCode"
            autoFocus
            value={otp}
            onChangeText={handleOtpChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={6}
          />

          {/* ===== Error Banner (Premium) ===== */}
          {isError && (
            <View className="mt-6 px-4 py-3 rounded-xl bg-red-50 border border-red-100 mx-4">
              <Text className="text-red-600 text-sm text-center font-poppins-regular leading-relaxed">
                {error.message}
              </Text>
            </View>
          )}

          {/* ===== FAB ===== */}
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
