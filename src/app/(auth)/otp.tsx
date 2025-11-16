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
      className="flex-1 bg-white p-5"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 140 : 80}
    >
      <StackHeader />

      {/* Soft doodles */}
      <View className="absolute top-[-40] right-[-40] w-48 h-48 bg-[#F6EFFF] rounded-full opacity-40 blur-3xl" />
      <View className="absolute top-[100] left-[-60] w-56 h-56 bg-[#EAF2FF] rounded-full opacity-35 blur-3xl" />
      <View className="absolute bottom-[-40] right-[-50] w-64 h-64 bg-[#F3FFE8] rounded-full opacity-30 blur-3xl" />

      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          otpRef.current?.blur();
        }}
        accessible={false}
      >
        <View className="flex-1 justify-start pt-10">

          {/* Title */}
          <Text className="text-[28px] font-poppins-semibold text-[#0A0A0A] text-center leading-snug px-6">
            Enter Your
            <Text className="text-[#7454F6]"> Verification </Text>
            Code
          </Text>

          {/* Subtitle */}
          <Text className="text-center text-[#6B6B6B] mt-2 font-poppins-regular italic tracking-wide px-8">
            Sent to <Text className="text-[#4A4A4A]">{phone}</Text>
          </Text>

          <View className="h-14" />

          {/* OTP Boxes */}
          <Pressable
            onPress={() => otpRef.current?.focus()}
            className="flex-row gap-3 justify-center h-16 px-4"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <View
                key={index}
                className="flex-1 h-16 rounded-2xl bg-white border border-[#DDD] items-center justify-center"
                style={{
                  borderColor:
                    isFocused && otp.length === index
                      ? "#BBA7FF"
                      : "#E1E1E1",
                }}
              >
                <Text className="text-3xl font-poppins-semibold text-[#111]">
                  {otp[index] || ""}
                </Text>

                {/* Blinking Cursor */}
                {isFocused && otp.length === index && otp.length < 6 && (
                  <Animated.View
                    style={{
                      position: "absolute",
                      width: 2,
                      height: 32,
                      backgroundColor: "#7454F6",
                      opacity: blinkAnim,
                      borderRadius: 1,
                      bottom: 12,
                    }}
                  />
                )}
              </View>
            ))}
          </Pressable>

          {/* Hidden input */}
          <TextInput
            className="absolute h-1 w-1 opacity-0"
            ref={otpRef}
            style={Platform.OS === "ios" ? { lineHeight: undefined } : undefined}
            selectionColor={colors.black}
            keyboardType="numeric"
            textContentType="oneTimeCode"
            autoFocus={true}
            value={otp}
            onChangeText={handleOtpChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={6}
          />

          {/* Error */}
          {isError && (
            <Text className="text-red-500 text-sm text-center mt-4 font-poppins-regular">
              {error.message}
            </Text>
          )}

          {/* FAB */}
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
