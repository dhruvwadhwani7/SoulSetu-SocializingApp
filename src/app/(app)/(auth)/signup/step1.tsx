import Button_Pressable from "@/components/Button_Pressable";
import ArrowLeft from "@/components/icons/arrow_left";
import Input from "@/components/Input";
import SelectInput from "@/components/SelectInput";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const router = useRouter();

  // local UI state for inputs (pure UI, no form library)
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDOB] = useState("");
  const [gender, setGender] = useState(""); // new gender state

  const nameInputRef = useRef<any>(null);
  const phoneInputRef = useRef<any>(null);
  const dobInputRef = useRef<any>(null);

  const handleNext = () => {
    // pure UI: placeholder behavior
    console.log("Step 1 ---> Next pressed", { name, phone, dob, gender });
    router.push("/(app)/(auth)/signup/step2");
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

        <Text style={styles.heading}>{"Basic Info"}</Text>
        <View>
          {/* Pure UI inputs (controlled local state) */}
          <Input
            ref={nameInputRef}
            label="Name"
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
          />
          <Input
            ref={phoneInputRef}
            label="Phone"
            placeholder="Your Phone Number"
            type="phone"
            value={phone}
            onChangeText={setPhone}
          />
          <Input
            ref={dobInputRef}
            label="Date Of Birth"
            placeholder="Your Birth Date"
            type="dob"
            value={dob}
            onChangeText={setDOB}
          />

          {/* Gender select */}
          <SelectInput
            label="Gender"
            options={["Male", "Female", "Transgender"]}
            value={gender}
            onChange={setGender}
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
