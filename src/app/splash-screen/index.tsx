import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "#000000",
            fontSize: 24,
            textAlign: "center",
          }}
        >
          {"S  O  U  L  S  E  T  U "}
        </Text>
        <Text
          style={{
            color: "#050505",
            fontSize: 12,
            textAlign: "center",
          }}
        >
          {"A Bridge Between Two Hearts "}
        </Text>
      </View>
    </SafeAreaView>
  );
}
