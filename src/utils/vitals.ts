import { PrivateProfile } from "@/api/my-profile/types";
import { age } from "@/utils/age";

export const vitals = [
  {
    title: "Name",
    getValue: (profile: PrivateProfile) => {
      return profile?.first_name || "None";
    },
    route: "/profile/name",
  },
  {
    title: "Age",
    getValue: (profile: PrivateProfile) => {
      return profile?.dob ? age(profile?.dob) : "None";
    },
    route: "/profile/age",
  },
  {
    title: "Height",
    getValue: (profile: PrivateProfile) => {
      return profile?.height_cm ? profile?.height_cm + " cm" : "None";
    },
    route: "/profile/height",
  },
  {
    title: "Location",
    getValue: (profile: PrivateProfile) => {
      return profile?.neighborhood || "None";
    },
    route: "/profile/location",
  },
  {
    title: "Ethnicity",
    getValue: (profile: PrivateProfile) => {
      return (
        profile?.ethnicities.map((ethnicity) => ethnicity.name).join(", ") ||
        "None"
      );
    },
    route: "/profile/ethnicity",
  },
  {
    title: "Children",
    getValue: (profile: PrivateProfile) => {
      return profile?.children?.name || "None";
    },
    route: "/profile/children",
  },
  {
    title: "Family Plans",
    getValue: (profile: PrivateProfile) => {
      return profile?.family_plan?.name || "None";
    },
    route: "/profile/family-plans",
  },
  {
    title: "Covid Vaccine",
    getValue: (profile: PrivateProfile) => {
      return profile?.covid_vaccine?.name || "None";
    },
    route: "/profile/covid-vaccine",
  },
  {
    title: "Pets",
    getValue: (profile: PrivateProfile) => {
      return profile?.pets.map((pet) => pet.name).join(", ") || "None";
    },
    route: "/profile/pets",
  },
  {
    title: "Zodiac Sign",
    getValue: (profile: PrivateProfile) => {
      return profile?.zodiac_sign?.name || "None";
    },
    route: "/profile/zodiac-sign",
  },
];
