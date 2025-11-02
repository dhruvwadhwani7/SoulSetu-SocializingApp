import { useSignOut } from "@/api/auth";
import { Text, View } from "react-native";

export default function Page() {
  const { mutate } = useSignOut()
  return (
    <View>
      <Text onPress={()=>mutate()}>Index</Text>
    </View>
  );
}
