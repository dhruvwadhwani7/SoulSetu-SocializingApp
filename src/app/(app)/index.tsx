import { useMyProfile } from "@/api/my-profile";
import { usePrompts, useChildren, useCovidVaccine, useEthnicities, useFamilyPlans, useGenders, usePets, usePronouns, useSexualities, useZodiacSigns } from "@/api/options";
import { Redirect } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";


export default function Page() {
  const { isPending, isError ,data} = useMyProfile();
  usePrompts();
  useChildren();
  useCovidVaccine();
  useEthnicities();
  useFamilyPlans();
  useGenders();
  usePets();
  usePronouns();
  useSexualities();
  useZodiacSigns();


  if (isPending) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size={"small"} />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text>Something went wrong.</Text>
      </View>
    );
  }

  if (data) {
    console.log(data);
    return (
      <ScrollView className="flex-1 bg-white">
        <Text>{JSON.stringify(data)}</Text>
      </ScrollView>
    )
  }
  

  return <Redirect href={"/(app)/(tabs)"} />;
}