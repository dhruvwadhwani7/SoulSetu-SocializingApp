import { PrivateProfile } from "@/api/my-profile/types";

export const emptyProfile: PrivateProfile = {
  id: "",

  first_name: "",

  last_name: "",

  dob: "",

  height_cm: 0,

  neighborhood: "",

  latitude: 0,

  longitude: 0,

  max_distance_km: 0,

  min_age: 18,

  max_age: 60,

  phone: "",

  children: null,

  family_plan: null,

  covid_vaccine: null,

  zodiac_sign: null,

  sexuality: null,

  gender: null,

  ethnicities: [],

  pets: [],

  pronouns: [],

  ethnicity_preferences: [],

  gender_preferences: [],

  answers: [],

  photos: [],

  avatar_url: "",
};
