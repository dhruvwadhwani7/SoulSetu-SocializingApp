import { PhotoGrid } from "@/components/photo-grid";
import { useEdit } from "@/store/edit";
import { ScrollView, Text, View } from "react-native";

export default function Page() {
  const { edits, gridActive } = useEdit();

  if (!edits) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text>Something went wrong.</Text>
      </View>
    );
  }
  return (
    <ScrollView
      className="flex-1 bg-white pt-10"
      contentContainerClassName="pb-20"
      showsVerticalScrollIndicator={false}
      scrollEnabled={!gridActive}
    >
      <View className="px-5">
        <Text className="text-base font-poppins-semibold mb-2">My Photos</Text>
        <PhotoGrid profile={edits} />
      </View>
    </ScrollView>
  );
}
