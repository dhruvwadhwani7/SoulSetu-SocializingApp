import Button_Pressable from "@/components/Button_Pressable";
import ArrowLeft from "@/components/icons/arrow_left";
import Input from "@/components/Input";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: "",
      otp: "",
    },
  });

  const router = useRouter();

  const phoneInputRef = useRef<any>(null);
  const otpInputRef = useRef<any>(null);

  // Add animated scale ref for press feedback (resend OTP)
  const scale = useRef(new Animated.Value(1)).current;

  // Add separate animated scale for "CREATE NEW ACCOUNT" press feedback
  const acctScale = useRef(new Animated.Value(1)).current;

  const onCreatePressIn = () => {
    Animated.spring(acctScale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 20,
      bounciness: 0,
    }).start();
  };

  const onCreatePressOut = () => {
    Animated.spring(acctScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  };

  const handleCreateAccount = () => {
    // replace with actual navigation or logic
    console.log("Create New Account pressed");
  };

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
      bounciness: 0,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  };

  const handleResend = () => {
    // replace with actual resend logic
    console.log("Resend OTP pressed");
  };

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
    router.replace("/(app)/(tabs)/profile");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainView}>
        {/* replaced Image with ArrowLeft component */}
        <ArrowLeft
          style={styles.arrowIcon}
          width={16}
          height={16}
          fill="black"
        />

        <Text style={styles.heading}>{"Sign in"}</Text>
        <View>
          <Controller
            control={control}
            name="phone"
            rules={{
              required: "Phone is required",
              pattern: {
                value: /^\d{10}$/,
                message: "Phone must be 10 digits",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                ref={phoneInputRef}
                label="Phone Number"
                placeholder="Enter Your Phone Number"
                type="phone"
                value={value}
                onChangeText={onChange}
                error={errors.phone?.message as any}
              />
            )}
          />
          <Controller
            control={control}
            name="otp"
            rules={{}}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                ref={otpInputRef}
                label="OTP"
                placeholder="Enter OTP Here "
                type="phone"
                value={value}
                onChangeText={onChange}
                error={errors.otp?.message as any}
              />
            )}
          />
          {/* Replace the plain Text with an interactive Pressable + Animated.Text */}
          <Pressable
            onPress={handleResend}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.resendPressable,
              pressed ? styles.resendPressablePressed : null,
            ]}
          >
            <Animated.Text
              style={[
                styles.text2,
                {
                  transform: [{ scale }],
                },
              ]}
            >
              Resend OTP
            </Animated.Text>
          </Pressable>
        </View>

        {/* bottom fixed block */}
        <View style={styles.bottomContainerPointer} pointerEvents="box-none">
          <View style={{ alignItems: "center" }}>
            {/* split into static text + interactive create-account pressable */}
            <View style={styles.createRow}>
              <Text style={styles.createLabel}>{"Dont have an account?"}</Text>
              <Pressable
                onPress={handleCreateAccount}
                onPressIn={onCreatePressIn}
                onPressOut={onCreatePressOut}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.createPressable,
                  pressed ? styles.createPressablePressed : null,
                ]}
              >
                <Animated.Text
                  style={[
                    styles.createAccountText,
                    { transform: [{ scale: acctScale }] },
                  ]}
                >
                  {"Create New Account"}
                </Animated.Text>
              </Pressable>
            </View>

            <Button_Pressable
              onPress={handleSubmit(onSubmit)}
              title="Next"
              accessibilityRole="button"
              style={styles.button}
              textStyle={styles.buttonText}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  arrowIcon: {
    width: 16,
    height: 16,
    marginTop: 67,
    marginBottom: 58,
    marginLeft: 23,
  },
  mainView: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  heading: {
    color: "#050505",
    fontSize: 20,
    marginBottom: 27,
    marginLeft: 23,
    fontWeight: "700",
  },
  text: {
    color: "#5C5B5B",
    fontSize: 10,
    marginBottom: 17,
  },
  // label used inside the create row so it doesn't add bottom margin/shift the row
  createLabel: {
    color: "#5C5B5B",
    fontSize: 10,
    marginBottom: 0,
  },
  createRow: {
    flexDirection: "row",
    alignItems: "center",
    // keep same spacing as the original single-line text had
    marginBottom: 17,
  },
  createPressable: {
    // keep touch target comfortable
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  createPressablePressed: {
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  createAccountText: {
    color: "#5C5B5B",
    fontSize: 10,
    fontWeight: "700", // bold so it reads clickable
    textDecorationLine: "underline",
    // explicit left spacing so text sits next to the label
    marginLeft: 3,
  },
  text2: {
    color: "#5C5B5B",
    fontSize: 12,
    marginLeft: 23,
    // make text a bit bolder so press feedback reads well
    fontWeight: "600",
  },
  // Pressable container so we can give a subtle rounded background and shadow
  resendPressable: {
    marginLeft: 23,
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    // subtle background for tactile area
    backgroundColor: "transparent",
  },
  // style applied while Pressable reports pressed (instant visual feedback)
  resendPressablePressed: {
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  buttonText: {
    color: "#5C5B5B",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#E6E6E6",
    borderRadius: 10,
    paddingTop: 12,
    paddingBottom: 11,
    paddingHorizontal: 75,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainerPointer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: "center",
  },
});
