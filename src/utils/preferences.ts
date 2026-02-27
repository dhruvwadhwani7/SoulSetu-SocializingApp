import { PrivateProfile } from "@/api/my-profile/types";

export const memberPreferences = [
  {
    title: "I'm interested in",
    getValue: (profile: PrivateProfile) => {
      return (
        profile?.gender_preferences.map((gender) => gender.name).join(", ") ||
        "Everyone"
      );
    },
    route: "/preferences/preferTypes/gender",
  },
  {
    title: "My neighborhood",
    getValue: (profile: PrivateProfile) => {
      return profile?.neighborhood || "None";
    },
    route: "/preferences/preferTypes/neighborhood",
  },
  {
    title: "Maximum distance",
    getValue: (profile: PrivateProfile) => {
      return `${profile?.max_distance_km} km`;
    },
    route: "/preferences/preferTypes/distance",
  },
  {
    title: "Age range",
    getValue: (profile: PrivateProfile) => {
      return `${profile?.min_age} - ${profile?.max_age}`;
    },
    route: "/preferences/preferTypes/age",
  },
  {
    title: "Ethnicity",
    getValue: (profile: PrivateProfile) => {
      return (
        profile?.ethnicity_preferences
          .map((ethnicity) => ethnicity.name)
          .join(", ") || "Open to all"
      );
    },
    route: "/preferences/preferTypes/ethnicity",
  },
];
