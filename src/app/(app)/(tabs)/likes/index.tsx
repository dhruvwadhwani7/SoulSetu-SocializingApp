import { useLikes } from "@/api/profiles";
import { Empty } from "@/components/empty";
import { LikeCard } from "@/components/like-card";
import { Loader } from "@/components/loader";
import { useRefreshOnFocus } from "@/hooks/refetch";
import { Link } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { data, isFetching, isError, refetch } = useLikes();
  useRefreshOnFocus(refetch);

  /* ===== Empty / Error / Loading ===== */
  const renderEmpty = () => {
    if (isFetching) return <Loader width={120} height={120}/>;

    if (isError) {
      return (
        <Empty
          title="Something went wrong"
          subTitle="We couldn’t load your likes right now."
          primaryText="Try again"
          onPrimaryPress={() => refetch()}
        />
      );
    }

    return (
      <Empty
        title="No likes yet"
        subTitle="Meaningful connections take time."
      />
    );
  };

  return (
    <View className="flex-1 bg-[#FAFAFB]">
      {/* Ambient background glow */}
      <View className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-[#EFEAFF] opacity-35 blur-[160px]" />

      {/* ===== SAFE HEADER (same as Matches) ===== */}
      <SafeAreaView edges={["top"]}>
        <View className="px-6 pt-4 pb-4">
          <Text className="text-[28px] font-poppins-semibold text-[#111]">
            Likes You
          </Text>

          <Text className="text-[13px] text-neutral-500 mt-1">
            People interested in connecting with you
          </Text>

          <View className="mt-4 h-px bg-neutral-200/70" />
        </View>
      </SafeAreaView>

      {/* ===== LIKES GRID ===== */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <Link href={`/likes/${item.id}`} asChild>
            <Pressable className="flex-1">
              <LikeCard like={item} />
            </Pressable>
          </Link>
        )}
        contentContainerClassName="px-5 pb-28 gap-6"
        columnWrapperClassName="gap-6"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}
