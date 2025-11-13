import { Profile } from "@/types/profile";
import { FC, JSX } from "react";
import { ScrollView, Text } from "react-native";
import { ProfileAnswer } from "./profile-answer";
import { ProfileItem } from "./profile-item";
import { ProfilePhoto } from "./profile-photo";
import { ProfileTraits } from "./profile-traits";

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

    layout.forEach((item, _) => {
      if (item === "traits") {
        elements.push(<ProfileTraits key={item} profile={profile} />);
      }
      if (item === "photo" && photoIndex < photos.length) {
        const item = photos[photoIndex++];
        elements.push(
          <ProfileItem
            key={`p${item.id}`}
            onLike={onLike}
            item={item}
            type="photo"
          >
            <ProfilePhoto photo={item} />
          </ProfileItem>
        );
      }
      if (item === "answer" && answerIndex < answers.length) {
        const item = answers[answerIndex++];
        elements.push(
          <ProfileItem
            key={`a${item.id}`}
            onLike={onLike}
            item={item}
            type="answer"
          >
            <ProfileAnswer answer={item} />
          </ProfileItem>
        );
      }
    });

    return elements;
  };
  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="pt-5 pb-28 gap-5"
      showsVerticalScrollIndicator={false}
    >
      {!myProfile && (
        <Text className="text-3xl  font-poppins-semibold">
          {profile.first_name}
        </Text>
      )}
      {generateProfile()}
    </ScrollView>
  );
};