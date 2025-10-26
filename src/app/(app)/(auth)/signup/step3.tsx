import Button_Pressable from "@/components/Button_Pressable";
import ArrowLeft from "@/components/icons/arrow_left";
import Input from "@/components/Input";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const router = useRouter();

  // local UI state for inputs (pure UI, no form library)
  const [bio, setBio] = useState("");

  const bioInputRef = useRef<any>(null);

  // animated action text (right of ArrowLeft)
  const actionScale = useRef(new Animated.Value(1)).current;
  const onActionIn = () =>
    Animated.spring(actionScale, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 20,
      bounciness: 0,
    }).start();
  const onActionOut = () =>
    Animated.spring(actionScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();

  const handleNext = () => {
    // pure UI: placeholder behavior
    console.log("Step 3 ---> Next pressed", { bio });
    router.push("/(app)/(auth)/signup/step4");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainView}>
        {/* header with back and action */}
        <View style={styles.headerRow}>
          <ArrowLeft
            style={styles.arrowIcon}
            width={16}
            height={16}
            fill="black"
          />
          <Pressable
            onPress={() => {
              console.log("Skip pressed");
              router.push("/(app)/(auth)/signup/step4");
            }}
            onPressIn={onActionIn}
            onPressOut={onActionOut}
            accessibilityRole="button"
          >
            <Animated.Text
              style={[
                styles.headerActionText,
                { transform: [{ scale: actionScale }] },
              ]}
            >
              Skip
            </Animated.Text>
          </Pressable>
        </View>

        <Text style={styles.heading}>
          {"Brag A Little About Yourself Or A Lot"}
        </Text>
        <View>
          {/* textarea-like input */}
          <Input
            ref={bioInputRef}
            placeholder="Write About Yourself"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={6}
            containerStyle={styles.bioInput}
          />
        </View>

        {/* bottom fixed block */}
        <View style={styles.bottomContainerPointer} pointerEvents="box-none">
          <View style={{ alignItems: "center" }}>
            <Button_Pressable
              onPress={handleNext}
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
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
  mainView: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 23,
    paddingTop: 67,
    marginBottom: 24,
  },
  headerActionText: {
    color: "red",
    fontSize: 14,
    fontWeight: "600",
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
  bioInput: {
    borderRadius: 10, // more square corners
    minHeight: 300, // taller to be more square-like
  },
});
