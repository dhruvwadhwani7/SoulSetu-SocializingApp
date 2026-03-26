import { PrivateProfile } from "@/api/my-profile/types";
import { age } from "@/utils/age";

export const vitals = [
  {
    title: "Name",
    getValue: (profile: PrivateProfile) => {
      return profile?.first_name || "None";
    },
    route: "/profile/vitals/name",
  },
  {
    title: "Age",
    getValue: (profile: PrivateProfile) => {
      return profile?.dob ? age(profile?.dob) : "None";
    },
    route: "/profile/vitals/age",
  },
  {
    title: "Height",
    getValue: (profile: PrivateProfile) => {
      return profile?.height_cm ? profile?.height_cm + " cm" : "None";
    },
    route: "/profile/vitals/height",
  },
  {
    title: "Location",
    getValue: (profile: PrivateProfile) => {
      return profile?.neighborhood || "None";
    },
    route: "/profile/vitals/location",
  },
  {
    title: "Ethnicity",
    getValue: (profile: PrivateProfile) => {
      return (
        profile?.ethnicities.map((ethnicity) => ethnicity.name).join(", ") ||
        "None"
      );
    },
    route: "/profile/vitals/ethnicity",
  },
  {
    title: "Children",
    getValue: (profile: PrivateProfile) => {
      return profile?.children?.name || "None";
    },
    route: "/profile/vitals/children",
  },
  {
    title: "Family Plans",
    getValue: (profile: PrivateProfile) => {
      return profile?.family_plan?.name || "None";
    },
    route: "/profile/vitals/family-plans",
  },
  {
    title: "Covid Vaccine",
    getValue: (profile: PrivateProfile) => {
      return profile?.covid_vaccine?.name || "None";
    },
    route: "/profile/vitals/covid-vaccine",
  },
  {
    title: "Pets",
    getValue: (profile: PrivateProfile) => {
      return profile?.pets.map((pet) => pet.name).join(", ") || "None";
    },
    route: "/profile/vitals/pets",
  },
  {
    title: "Zodiac Sign",
    getValue: (profile: PrivateProfile) => {
      return profile?.zodiac_sign?.name || "None";
    },
    route: "/profile/vitals/zodiac-sign",
  },
];
