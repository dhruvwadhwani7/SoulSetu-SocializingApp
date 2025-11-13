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
    if (isError) {
      reset();
    }
    setOtp(text);
  };

  const isValid = useMemo(() => {
    return otp.length === 6;
  }, [otp]);

  const handleSubmit = () => {
    verifyOtp({ phone, token: otp });
  };

  useEffect(() => {
    if (isFocused && otp.length < 6) {
      loopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 500,
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
      keyboardVerticalOffset={100}
    >
      <StackHeader />
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          otpRef.current?.blur();
        }}
        accessible={false}
      >
        <View className="flex-1 justify-center pt-28">
          <View className="flex-1">
            <Text className="text-3xl font-poppins-medium">
              Enter your verification code?
            </Text>
            <View className="h-28" />
            <Pressable
              onPress={() => {
                // focus the hidden input to reopen keyboard
                otpRef.current?.focus();
              }}
              className="flex-row gap-2 h-16"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <View
                  key={index}
                  className="border-b flex-1 items-center justify-center"
                >
                  <Text className="text-4xl font-poppins-semibold">
                    {otp[index] || ""}
                  </Text>
                  {isFocused && otp.length === index && otp.length < 6 && (
                    <Animated.View
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 2,
                        height: 36,
                        backgroundColor: colors.black,
                        opacity: blinkAnim,
                        borderRadius: 1,
                        transform: [{ translateX: -1 }, { translateY: -18 }],
                      }}
                    />
                  )}
                </View>
              ))}
            </Pressable>
            <TextInput
              // hidden but focusable input
              className="absolute h-1 w-1 opacity-0"
              ref={otpRef}
              style={
                Platform.OS === "ios" ? { lineHeight: undefined } : undefined
              }
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
