import { useLikes, useMatch, useRemoveLike } from "@/api/profiles";
import { Fab } from "@/components/fab";
import { ProfileView } from "@/components/profile-view";
import { transformPublicProfile } from "@/utils/profile";
import { Image } from "expo-image";
import { Redirect, Stack, router, useLocalSearchParams } from "expo-router";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mutate: remove, isPending: removePending } = useRemoveLike();
  const { mutate: match, isPending: matchPending } = useMatch();

  const { data } = useLikes();
  const like = data.find((like) => like.id === id);

  // 🔒 Guard: like not found
  if (!like) {
    return <Redirect href="/likes" />;
  }

  // 🔒 Guard: profile missing (runtime safety)
  if (!like.profile) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-neutral-600">
          This profile is no longer available.
        </Text>
      </View>
    );
  }

  const profile = transformPublicProfile(like.profile);

  const handleRemove = () => {
    remove(like.id, {
      onSuccess: () => {
        router.back();
      },
      onError: () => {
        Alert.alert("Error", "Something went wrong, please try again later");
      },
    });
  };

  const handleMatch = () => {
    match(like.id, {
      onSuccess: () => {
        router.back();
        console.log("mathc success")
      },
      onError: (error) => {
        console.log("error found",error)
        Alert.alert("Error", "Something went wrong, please try again later");
      },
    });
  };

  return (
    <View className="flex-1 px-5 bg-white">
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Pressable onPressOut={() => router.back()}>
              <Text className="text-base font-poppins-medium">
                All
              </Text>
            </Pressable>
          ),
          title: "",
          headerShadowVisible: false,
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="h-28 bg-neutral-200 overflow-hidden rounded-md">
          {like.photo_url ? (
            <Image source={like.photo_url} className="aspect-square w-full" />
          ) : (
            <View className="flex-1 justify-center p-5">
              <Text className="text-xl font-playfair-semibold">
                {like.answer_text}
              </Text>
            </View>
          )}
        </View>

        <ProfileView profile={profile} />
      </ScrollView>

      <Fab
        className="absolute bottom-5 left-5 bg-white shadow-sm h-20"
        iconClassName="text-black text-4xl"
        iconName="close"
        onPress={handleRemove}
        loading={removePending}
        loaderClassName="text-black"
        disabled={removePending || matchPending}
      />

      <Fab
        className="absolute bottom-5 right-5 bg-white shadow-sm h-20"
        iconClassName="text-black text-4xl"
        iconName="chatbox-outline"
        onPress={handleMatch}
        loading={matchPending}
        loaderClassName="text-black"
        disabled={removePending || matchPending}
      />
    </View>
  );
};

export default Page;
