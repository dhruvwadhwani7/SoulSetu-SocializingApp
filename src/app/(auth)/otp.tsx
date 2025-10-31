import { Fab } from "@/components/fab";
import { StackHeader } from "@/components/stack-header";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import colors from "tailwindcss/colors";

export default function Page() {
  const [otp, setOtp] = useState("");
  const { phone } = useLocalSearchParams<{ phone: string }>();

  const handleOtpChange = (text: string) => {
    setOtp(text);
  };

  const isValid = useMemo(() => {
    return otp.length === 6;
  }, [otp]);

 const handleSubmit = () => {};

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white p-5"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <StackHeader />
      <StatusBar barStyle={"dark-content"} />
      <View className="flex-1 justify-center pt-28">
        <View className="flex-1">
          <Text className="text-4xl font-playfair-semibold">
            Enter your verification code?
          </Text>
          <View className="h-28" />
          <View className="flex-row gap-2 h-16">
            {Array.from({ length: 6 }).map((_, index) => (
              <View
                key={index}
                className="border-b flex-1 items-center justify-center"
              >
                <Text className="text-4xl font-poppins-semibold">
                  {otp[index] || ""}
                </Text>
              </View>
            ))}
          </View>
          <TextInput
            className="absoulte h-1 w-1 opacity-0"
            style={
              Platform.OS === "ios" && {
                lineHeight: undefined,
              }
            }
            selectionColor={colors.black}
            keyboardType="numeric"
            textContentType="oneTimeCode"
            autoFocus={true}
            value={otp}
            onChangeText={handleOtpChange}
            maxLength={6}
          />
        </View>
        <View className="items-end">
          <Fab
            disabled={!isValid}
            onPress={handleSubmit}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}