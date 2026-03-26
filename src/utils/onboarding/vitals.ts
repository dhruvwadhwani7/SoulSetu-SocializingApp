import { PrivateProfile } from "@/api/my-profile/types";
import { age } from "@/utils/profile/age";

export const onboardingVitals = [
  {
    title: "Name",

    getValue: (profile: PrivateProfile) => profile.first_name || "None",

    route: "/(app)/onboarding/edit/vitals/name",
  },

  {
    title: "Age",

    getValue: (profile: PrivateProfile) =>
      profile.dob ? age(profile.dob) : "None",

    route: "/(app)/onboarding/edit/vitals/age",
  },

  {
    title: "Height",

    getValue: (profile: PrivateProfile) =>
      profile.height_cm ? profile.height_cm + " cm" : "None",

    route: "/(app)/onboarding/edit/vitals/height",
  },


  {
    title:"Gender",

    getValue:(profile:PrivateProfile)=>{

      return profile?.gender?.name || "None"

    },

    route:"/(app)/onboarding/edit/vitals/gender"

  },

  {
    title:"Pronouns",

    getValue:(profile:PrivateProfile)=>{

      return profile?.pronouns?.length

        ? profile.pronouns.map(p=>p.name).join(", ")

        : "None"

    },

    route:"/(app)/onboarding/edit/vitals/pronouns"

  }
];
