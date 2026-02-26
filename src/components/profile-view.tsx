import { Profile } from "@/types/profile";
import { FC, JSX } from "react";
import { ScrollView, Text, View } from "react-native";
import { ProfileAnswer } from "./profile-answer";
import { ProfileItem } from "./profile-item";
import { ProfilePhoto } from "./profile-photo";
import { ProfileTraits } from "./profile-traits";
import { ProfileSpotify } from "./profile-spotify";

interface Props {
  profile: Profile;
  myProfile?: boolean;
  onLike?: (id: string, type: "answer" | "photo") => void;
}

export const ProfileView: FC<Props> = ({ profile, myProfile, onLike }) => {
  const generateProfile = (): JSX.Element[] => {
    const elements: JSX.Element[] = [];

    const layout: ("photo" | "answer" | "traits")[] = [
      "photo",
      "answer",
      "traits",
      "photo",
      "photo",
      "answer",
      "photo",
      "answer",
      "photo",
      "photo",
    ];

    const { photos, answers } = profile;
    let photoIndex = 0;
    let answerIndex = 0;

    layout.forEach((item, i) => {
      if (item === "traits") {
        elements.push(
          <View key={`traits_${i}`} style={{ paddingHorizontal: 6 }}>
            <ProfileTraits profile={profile} />
          </View>,
        );
      }

      if (
        item === "traits" &&
        profile.spotify_show_on_profile &&
        profile.spotify_top_artists?.length
      ) {
        elements.push(
          <View key={`spotify_${i}`} style={{ paddingHorizontal: 6 }}>
            <ProfileSpotify artists={profile.spotify_top_artists} />
          </View>,
        );
      }

      if (item === "photo" && photoIndex < photos.length) {
        const photo = photos[photoIndex++];
        elements.push(
          <View key={`photo_${photo.id}`} style={{ paddingHorizontal: 6 }}>
            <ProfileItem onLike={onLike} item={photo} type="photo">
              <ProfilePhoto photo={photo} />
            </ProfileItem>
          </View>,
        );
      }

      if (item === "answer" && answerIndex < answers.length) {
        const answer = answers[answerIndex++];
        elements.push(
          <View key={`answer_${answer.id}`} style={{ paddingHorizontal: 6 }}>
            <ProfileItem onLike={onLike} item={answer} type="answer">
              <ProfileAnswer answer={answer} />
            </ProfileItem>
          </View>,
        );
      }
    });

    return elements;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* Doodles */}
      <View className="absolute -top-16 right-0 w-44 h-44 bg-[#EDE6FF] opacity-30 rounded-full blur-3xl" />
      <View className="absolute bottom-0 left-[-40] w-52 h-52 bg-[#F4F1FF] opacity-40 rounded-full blur-3xl" />

      <ScrollView
        className="flex-1"
        contentContainerClassName="pt-12 pb-32 gap-6 px-3"
        showsVerticalScrollIndicator={false}
      >
        {/* Name Header */}
        {!myProfile && (
          <Text
            className="text-[34px] font-poppins-bold text-center text-[#1A1A1A]"
            style={{ letterSpacing: 1 }}
          >
            {profile.first_name}
          </Text>
        )}

        {/* Generated items */}
        {generateProfile()}
      </ScrollView>
    </View>
  );
};
