import { AnswerList } from "@/components/profileView/answer-list";
import { PhotoGrid } from "@/components/profileView/photo-grid";
import { List } from "@/components/shared/list";
import { useEdit } from "@/store/edit";
import { identity } from "@/utils/identity";
import { vitals } from "@/utils/vitals";
import { ScrollView, Text, View } from "react-native";

export default function Page() {
  const { edits, gridActive } = useEdit();

  if (!edits) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-8">
        <View
          className="w-full rounded-2xl border border-red-200 bg-red-50/40 px-6 py-6"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 14,
            elevation: 3,
          }}
        >
          <Text className="text-[16px] font-poppins-semibold text-red-600 text-center">
            Something went wrong
          </Text>

          <Text className="text-[13px] text-neutral-600 text-center mt-1 leading-relaxed">
            We couldn’t load this section right now.
          </Text>
        </View>
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

        <View className="mb-4 self-start rounded-full bg-[#F5F3FF] px-4">
          <Text className="text-[12px] text-[#6B5CF6] tracking-wide">
            Drag to reorder • Tap to change the photo
          </Text>
        </View>

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

        <View className="mb-4 self-start rounded-full bg-[#F5F3FF] px-4">
          <Text className="text-[12px] text-[#6B5CF6] tracking-wide">
            Drag to reorder • Tap to change the prompt
          </Text>
        </View>

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
