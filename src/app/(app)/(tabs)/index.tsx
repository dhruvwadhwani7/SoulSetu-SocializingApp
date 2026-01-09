import {
  useLikeProfile,
  useProfiles,
  useReviewProfiles,
  useSkipProfile,
} from "@/api/profiles";
import { Empty } from "@/components/empty";
import { Fab } from "@/components/fab";
import { Loader } from "@/components/loader";
import { ProfileView } from "@/components/profile-view";
import { useRefreshOnFocus } from "@/hooks/refetch";
import { transformPublicProfile } from "@/utils/profile";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";

export default function Page() {
  const { data, isFetching, error, refetch } = useProfiles();
  useRefreshOnFocus(refetch);

  const [currentIndex, setCurrentIndex] = useState(0);
  const { mutate: skip, isPending: skipPending } = useSkipProfile();
  const { mutate: review, isPending: reviewPending } = useReviewProfiles();
  const { mutate: like, isPending: likePending } = useLikeProfile();
  const queryClient = useQueryClient();

  const hasProfiles = data && data.length > 0;

  const profile = hasProfiles
    ? transformPublicProfile(data[currentIndex])
    : null;

  const handleSkip = () => {
    if (profile) {
      skip(profile?.id, {
        onSuccess: () => {
          if (hasProfiles && currentIndex < data.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else if (hasProfiles) {
            queryClient.invalidateQueries({
              queryKey: ["profiles"],
            });
            setCurrentIndex(0);
          }
        },
        onError: () => {
          Alert.alert("Error", "Something went wrong, please try again later");
        },
      });
    }
  };

  const handleReview = () => {
    review(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["profiles"],
        });
      },
      onError: () => {
        Alert.alert("Error", "Something went wrong, please try again later");
      },
    });
  };

  const handleLike = (id: string, type: "answer" | "photo") => {
    if (profile) {
      like(
        {
          profile: profile?.id,
          answer: type === "answer" ? id : undefined,
          photo: type === "photo" ? id : undefined,
        },
        {
          onSuccess: () => {
            if (hasProfiles && currentIndex < data.length - 1) {
              setCurrentIndex(currentIndex + 1);
            } else if (hasProfiles) {
              queryClient.invalidateQueries({
                queryKey: ["profiles"],
              });
              setCurrentIndex(0);
            }
          },
          onError: () => {
            Alert.alert(
              "Error",
              "Something went wrong, please try again later"
            );
          },
        }
      );
    }
  };

  if (isFetching || skipPending || reviewPending || likePending) {
    return <Loader />;
  }

  if (error) {
    return (
      <Empty
        title="Something went wrong"
        subTitle="We ran into a problem loading new people, sorry about that!"
        onPrimaryPress={refetch}
        primaryText="Try again"
      />
    );
  }

  if (!hasProfiles) {
    return (
      <Empty
        title="You've seen everyone for now"
        subTitle="Try changing your filters so more people match your criteria - or check back later!"
        primaryText="Change filters"
        secondaryText="Review skipped profiles"
        onPrimaryPress={() => router.push("/preferences")}
        onSecondaryPress={handleReview}
      />
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 px-5">
        <Link href={"/preferences"} suppressHighlighting className="w-full flex-row items-center justify-between mt-20 mb-2">
          <Ionicons name="options-outline" size={38} color="#7454F6"/>
        </Link>
        {profile && <ProfileView profile={profile} onLike={handleLike} />}
      </ScrollView>
      <Fab
        onPress={handleSkip}
        iconName="close"
        className="bg-white shadow-sm active:h-[4.75rem] h-20 absolute bottom-5 left-5"
        iconClassName="text-black text-4xl"
        loaderClassName="text-black"
      />
    </View>
  );
}