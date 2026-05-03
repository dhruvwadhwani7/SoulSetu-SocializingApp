import { PrivateProfile } from "@/api/my-profile/types";
import { PublicProfile } from "@/api/profiles/types";
import { Profile } from "@/types/profile";
import { age } from "./age";

const traitsMapping = [
  {
    key: "dob",
    icon: "calendar-outline",
    privateLabel: (profile: PrivateProfile) =>
      profile.dob ? `${age(profile.dob)}` : null,
    publicLabel: (profile: PublicProfile) =>
      profile.age ? `${profile.age.toString()}` : null,
  },
  {
    key: "gender",
    icon: "male-female-outline",
    privateLabel: (profile: PrivateProfile) => profile.gender?.name,
    publicLabel: (profile: PublicProfile) => profile.gender || null,
  },
  {
    key: "sexuality",
    icon: "heart-outline",
    privateLabel: (profile: PrivateProfile) => profile.sexuality?.name,
    publicLabel: (profile: PublicProfile) => profile.sexuality || null,
  },
  {
    key: "height_cm",
    icon: "resize-outline",
    privateLabel: (profile: PrivateProfile) =>
      profile.height_cm ? `${profile.height_cm} cm` : null,
    publicLabel: (profile: PublicProfile) =>
      profile.height_cm ? `${profile.height_cm} cm` : null,
  },
  {
    key: "location",
    icon: "location-outline",
    privateLabel: (profile: PrivateProfile) => profile.neighborhood,
    publicLabel: (profile: PublicProfile) => profile.neighborhood,
  },
  {
    key: "ethnicities",
    icon: "globe-outline",
    privateLabel: (profile: PrivateProfile) =>
      profile.ethnicities?.map((item) => item.name).join(", "),
    publicLabel: (profile: PublicProfile) => profile.ethnicities?.join(", "),
  },
  {
    key: "children",
    icon: "cart-outline",
    privateLabel: (profile: PrivateProfile) => profile.children?.name,
    publicLabel: (profile: PublicProfile) => profile.children || null,
  },
  {
    key: "family_plans",
    icon: "cart-outline",
    privateLabel: (profile: PrivateProfile) => profile.family_plan?.name,
    publicLabel: (profile: PublicProfile) => profile.family_plan || null,
  },
  {
    key: "pets",
    icon: "paw-outline",
    privateLabel: (profile: PrivateProfile) =>
      profile.pets?.map((item) => item.name).join(", "),
    publicLabel: (profile: PublicProfile) =>
      profile.pets?.map((item) => item).join(", "),
  },
  {
    key: "zodiac_sign",
    icon: "star-outline",
    privateLabel: (profile: PrivateProfile) => profile.zodiac_sign?.name,
    publicLabel: (profile: PublicProfile) => profile.zodiac_sign || null,
  },
];

export const transformPrivateProfile = (profile: PrivateProfile): Profile => {
  return {
    id: profile.id,
    first_name: profile.first_name,
    photos: profile.photos,
    answers: profile.answers,
    traits: traitsMapping.map((trait) => {
      const label = trait.privateLabel(profile);
      return {
        key: trait.key,
        icon: trait.icon,
        label: label || null,
      };
    }),
  };
};

export const transformPublicProfile = (
  profile: PublicProfile | null | undefined
): Profile => {
  if (!profile || !profile.id) {
    throw new Error("Invalid PublicProfile received");
  }

  return {
    id: profile.id,
    first_name: profile.first_name,
    photos: profile.photos ?? [],
    answers: profile.answers ?? [],
    traits: traitsMapping.map((trait) => {
      const label = trait.publicLabel(profile);
      return {
        key: trait.key,
        icon: trait.icon,
        label: label || null,
      };
    }),
  };
};

