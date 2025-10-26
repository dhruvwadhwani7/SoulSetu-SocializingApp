import Button_Pressable from "@/components/Button_Pressable";
import ArrowLeft from "@/components/icons/arrow_left";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native"; // added Pressable
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const router = useRouter();

  const handleNext = () => {
    console.log("Step 5 ---> Next pressed");
    // router.push("/(app)/(auth)/signup/step6");
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

        <Text style={styles.heading}>{"Where Do You Live?"}</Text>
        <View>
          <View style={styles.mainImageView}>
            <Image
              source={require("../../../../../assets/images/map-image.png")}
              resizeMode={"cover"}
              style={styles.mainImage}
            />
          </View>
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
    marginTop: 67,
    marginBottom: 58,
    marginLeft: 23,
  },
  mainView: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  mainImageView: {
    // changed: make container clip children and provide stable height
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#D9D9D9",
    borderRadius: 14,
    marginBottom: 15,
    marginHorizontal: 39,
    // you can tweak these
    height: 260, // ensures the container has space for the cover image
  },
  // changed: main image now covers the container
  mainImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  heading: {
    color: "#050505",
    fontSize: 20,
    marginBottom: 27,
    marginLeft: 23,
    fontWeight: "700",
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
