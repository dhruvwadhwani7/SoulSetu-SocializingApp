import { AnswerList } from "@/components/answer-list";
import { List } from "@/components/list";
import { PhotoGrid } from "@/components/photo-grid";
import { useEdit } from "@/store/edit";
import { identity } from "@/utils/identity";
import { vitals } from "@/utils/vitals";
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
      className="flex-1 bg-white"
      contentContainerClassName="pb-24"
      showsVerticalScrollIndicator={false}
      scrollEnabled={!gridActive}
    >
      {/* Subtle decorative background blobs */}
      <View className="absolute top-[-50] right-[-60] w-64 h-64 bg-[#F2EFFF] opacity-40 rounded-full blur-3xl" />
      <View className="absolute bottom-[-50] left-[-50] w-72 h-72 bg-[#F6F8FF] opacity-40 rounded-full blur-3xl" />

      <View className="px-6 pt-14">

        {/* Section Header: My Photos */}
        <Text
          style={{
            fontSize: 17,
            fontWeight: "600",
            color: "#1A1A1A",
            letterSpacing: 0.3,
            marginBottom: 12,
          }}
        >
          My Photos
        </Text>

        <PhotoGrid profile={edits} />

        <View style={{ height: 34 }} />

        {/* Section Header: Answers */}
        <Text
          style={{
            fontSize: 17,
            fontWeight: "600",
            color: "#1A1A1A",
            letterSpacing: 0.3,
            marginBottom: 12,
          }}
        >
          Answers
        </Text>

        <AnswerList profile={edits} />
      </View>

      {/* Additional Lists */}
      <View className="px-6 mt-6 gap-10">
        <List title="My Vitals" data={vitals} profile={edits} />
        <List title="Identity" data={identity} profile={edits} />
      </View>
    </ScrollView>
  );
}
