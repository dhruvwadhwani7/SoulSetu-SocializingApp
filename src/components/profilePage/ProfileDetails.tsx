import { View } from "react-native";
import CompactRow from "./CompactRow";
import { calculateAge, PROFILE_DETAILS } from "@/constants/profilePage";


export default function ProfileDetails({ profile }: any) {
  const getValue = (item: any) => {
    if (!profile) return null;

    if (item.type === "age") return profile.dob ? `${calculateAge(profile.dob)} yrs` : null;
    if (item.type === "height") return profile.height_cm ? `${profile.height_cm} cm` : null;
    if (item.type === "array") return profile.pronouns?.map((p: any) => p.name).join(", ");

    if (item.key.includes(".")) {
      const [a, b] = item.key.split(".");
      return profile[a]?.[b];
    }

    return profile[item.key];
  };

  return (
    <View
      className="bg-white/80 rounded-3xl px-3 py-2 backdrop-blur-xl"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 20,
        elevation: 4,
      }}
    >
      {PROFILE_DETAILS.map((item, index) => (
        <View key={item.label}>
          <CompactRow icon={item.icon as any} label={item.label} value={getValue(item)} />
          {index !== PROFILE_DETAILS.length - 1 && (
            <View className="h-px bg-neutral-200/60 mx-3" />
          )}
        </View>
      ))}
    </View>
  );
}