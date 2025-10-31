import { Fab } from "@/components/fab";
import { StackHeader } from "@/components/stack-header";
import { router, useFocusEffect } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { Platform, StatusBar, TextInput, Text, View, KeyboardAvoidingView } from "react-native";
import colors from "tailwindcss/colors";

export default function Page() {
  const [phone, setPhone] = useState("");
  const phoneRef = useRef<TextInput>(null)

  const handlePhoneChange = (text: string) => {
    setPhone(text);
  };

  const isValid = useMemo(() => {
    return /^\+[1-9]\d{1,14}$/.test(phone);
  }, [phone]);

  const handleSubmit = () => {
    router.push({
          pathname: "/otp",
          params: { phone },
        })
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
      <StatusBar barStyle={"dark-content"} />
      <View className="flex-1 justify-center pt-28">
        <View className="flex-1">
          <Text className="text-4xl font-playfair-semibold">
            What's your phone number?
          </Text>
          <View className="h-28" />
          <TextInput
            className="border-b h-16 text-4xl font-poppins-semibold"
            style={
              Platform.OS === "ios" && {
                lineHeight: undefined,
              }
            }
            selectionColor={colors.black}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            autoFocus={true}
            value={phone}
            onChangeText={handlePhoneChange}
            maxLength={16}
            ref={phoneRef}
          />
          {/* {isError && (
            <Text className="text-red-500 text-sm text-center mt-4">
              {error.message}
            </Text>
          )} */}
        </View>
        <View className="items-end">
          <Fab
            disabled={!isValid}
            onPress={handleSubmit}
            // loading={isPending}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
