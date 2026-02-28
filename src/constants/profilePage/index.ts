import { Href } from "expo-router";

export const QR_ACTIONS: {
  icon: any;
  label: string;
  route: Href;
}[] = [
  { icon: "scan-outline", label: "Scan QR", route: "/(app)/qr/scanqr" },
  { icon: "qr-code-outline", label: "My QR", route: "/(app)/qr/myqr" },
  { icon: "location-outline", label: "Explore", route: "/(app)/places" },
  { icon: "map-outline", label: "Nearby", route: "/(app)/osm" },
];

export const PROFILE_DETAILS = [
  { icon: "person-outline", label: "Name", key: "first_name" },
  { icon: "calendar-outline", label: "Age", key: "dob", type: "age" },
  { icon: "male-female-outline", label: "Gender", key: "gender.name" },
  { icon: "chatbubble-outline", label: "Pronouns", key: "pronouns", type: "array" },
  { icon: "heart-outline", label: "Sexuality", key: "sexuality.name" },
  { icon: "body-outline", label: "Height", key: "height_cm", type: "height" },
  { icon: "happy-outline", label: "Children", key: "children.name" },
  { icon: "sparkles-outline", label: "Zodiac", key: "zodiac_sign.name" },
  { icon: "location-outline", label: "Location", key: "neighborhood" },
];

export function calculateAge(date: string | Date) {
  const dob = new Date(date);
  const diff = Date.now() - dob.getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
}