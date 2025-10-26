import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const router = useRouter();

  // Animations for Discover and SignUp buttons
  const animDiscover = useRef(new Animated.Value(1)).current;
  const animSignUp = useRef(new Animated.Value(1)).current;

  // Helper: scale animation
  const animateIn = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 25,
      bounciness: 6,
    }).start();
  };

  const animateOut = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 25,
      bounciness: 6,
    }).start();
  };

  // Compute scale + opacity + background color animation
  const getAnimatedStyle = (
    anim: Animated.Value,
    baseStyle: any,
    pressedColor: string,
    defaultColor: string
  ) => {
    const opacity = anim.interpolate({
      inputRange: [0.95, 1],
      outputRange: [0.9, 1],
    });

    // Slight background tint change when pressed
    const backgroundColor = anim.interpolate({
      inputRange: [0.95, 1],
      outputRange: [pressedColor, defaultColor],
    });

    return [
      baseStyle,
      {
        transform: [{ scale: anim }],
        opacity,
        backgroundColor,
      },
    ];
  };

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  // Unified handler for press feedback + action
  const handlePress = (anim: Animated.Value, action: () => void) => {
    // Start immediate press animation
    animateIn(anim);

    // Trigger navigation/callback slightly after press
    setTimeout(() => {
      action();
    }, 50); // Sweet spot for overlap timing

    // Let it bounce back naturally
    animateOut(anim);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainView}>
        <Text style={styles.text}>{"Find Your Perfect Match"}</Text>

        {/* Discover Button */}
        <View style={styles.view}>
          <AnimatedPressable
            style={getAnimatedStyle(
              animDiscover,
              styles.view2,
              "#E5E5E5", // pressed shade
              "#F2F1F1" // default shade
            )}
            onPress={() =>
              handlePress(animDiscover, () => {
                console.log("Discover Button Clicked");
                router.push("/(app)/(auth)/login");
              })
            }
            accessibilityRole="button"
          >
            <Text style={styles.text2}>{"Discover"}</Text>
          </AnimatedPressable>
        </View>

        <View style={styles.view3}>
          <View style={styles.horizontalRule}></View>
        </View>

        {/* Create New Account Button */}
        <View style={styles.view4}>
          <AnimatedPressable
            style={getAnimatedStyle(
              animSignUp,
              styles.view5,
              "#888888", // pressed shade
              "#A9A9A9" // default shade
            )}
            onPress={() =>
              handlePress(animSignUp, () => {
                console.log("Create New Account Clicked");
                router.push("/(app)/(auth)/signup/step1");
              })
            }
            accessibilityRole="button"
          >
            <Text style={styles.text2}>{"Create New Account"}</Text>
          </AnimatedPressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  horizontalRule: {
    width: 272,
    height: 1,
    backgroundColor: "#A9A9A9",
  },
  mainView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#050505",
    fontSize: 24,
    textAlign: "center",
    marginTop: 259,
    marginBottom: 200,
    width: 124,
  },
  text2: {
    color: "#050505",
    fontSize: 12,
    fontWeight: "700",
  },
  view: {
    alignItems: "center",
    marginBottom: 26,
  },
  view2: {
    borderRadius: 10,
    paddingTop: 16,
    paddingBottom: 17,
    paddingHorizontal: 43,
    alignItems: "center",
  },
  view3: {
    alignItems: "center",
    marginBottom: 27,
  },
  view4: {
    alignItems: "center",
    marginBottom: 125,
  },
  view5: {
    borderRadius: 10,
    paddingTop: 17,
    paddingBottom: 17,
    paddingHorizontal: 7,
    alignItems: "center",
  },
});
