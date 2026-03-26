import { PrivateProfile } from "@/api/my-profile/types";


export const onboardingIdentityLifestyle = [

  {
    title:"Ethnicity",

    getValue:(profile:PrivateProfile)=>

      profile.ethnicities?.length

        ? profile.ethnicities.map(e=>e.name).join(", ")

        : "None",

    route:"/(app)/onboarding/edit/identity/ethnicity"

  },

  {
    title:"Sexuality",

    getValue:(profile:PrivateProfile)=>

      profile.sexuality?.name || "None",

    route:"/(app)/onboarding/edit/identity/sexuality"

  },

  {
    title:"Zodiac sign",

    getValue:(profile:PrivateProfile)=>

      profile.zodiac_sign?.name || "None",

    route:"/(app)/onboarding/edit/identity/zodiac-sign"

  },

  {
    title:"Pets",

    getValue:(profile:PrivateProfile)=>

      profile.pets?.length

        ? profile.pets.map(p=>p.name).join(", ")

        : "None",

    route:"/(app)/onboarding/edit/identity/pets"

  },

  {
    title:"Children",

    getValue:(profile:PrivateProfile)=>

      profile.children?.name || "None",

    route:"/(app)/onboarding/edit/identity/children"

  },

  {
    title:"Family plans",

    getValue:(profile:PrivateProfile)=>

      profile.family_plan?.name || "None",

    route:"/(app)/onboarding/edit/identity/family-plans"

  },

  {
    title:"Covid vaccine",

    getValue:(profile:PrivateProfile)=>

      profile.covid_vaccine?.name || "None",

    route:"/(app)/onboarding/edit/identity/covid-vaccine"

  }

]