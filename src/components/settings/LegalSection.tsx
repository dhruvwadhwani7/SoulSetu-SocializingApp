import { View } from "react-native";
import { router } from "expo-router";
import SettingsRow from "./SettingsRow";

export default function LegalSection() {
  return (
    <View
      className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 16,
        elevation: 3,
      }}
    >
      <SettingsRow
        label="Privacy Policy"
        onPress={() => router.push("/settings/other/privacy")}
      />

      <View className="h-px bg-neutral-200/60 mx-5" />

      <SettingsRow
        label="Terms & Conditions"
        onPress={() => router.push("/settings/other/terms")}
      />

      <View className="h-px bg-neutral-200/60 mx-5" />

      <SettingsRow
        label="Community Guidelines"
        onPress={() => router.push("/settings/other/guidelines")}
        noBorder
      />
    </View>
  );
}