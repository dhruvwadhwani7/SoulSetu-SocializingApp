import { View, Text } from "react-native";

import { useEdit } from "@/store/edit";
import { PrivateProfile } from "@/api/my-profile/types";

import { RadioList } from "@/components/shared/radio-list";
import { CheckboxList } from "@/components/shared/checkbox-list";

import {
  useEthnicities,
  useSexualities,
  useZodiacSigns,
  usePets,
  useChildren,
  useFamilyPlans,
  useCovidVaccine,
} from "@/api/options";
import {
  FieldLabel,
  StepFooter,
  StepHeader,
  StepLayout,
} from "@/components/onboarding";

export default function Page() {
  const { edits, setEdits } = useEdit();

  const { data: ethnicities } = useEthnicities();
  const { data: sexualities } = useSexualities();
  const { data: zodiacs } = useZodiacSigns();

  const { data: pets } = usePets();
  const { data: children } = useChildren();
  const { data: familyPlans } = useFamilyPlans();
  const { data: covidVaccine } = useCovidVaccine();

  const update = (field: string, value: any) => {
    setEdits({
      ...edits,
      [field]: value,
    } as PrivateProfile);
  };

  return (
    <StepLayout
      header={
        <StepHeader
          stepName="identity-lifestyle"
          title="Identity & Lifestyle"
          subtitle="Optional but helps improve matches"
        />
      }
      footer={
        <StepFooter nextRoute="/(app)/onboarding/location" showSkip={true} />
      }
    >
      <View className="mt-4">
        {/* ETHNICITY */}

        <FieldLabel label="Ethnicity" />

        <RadioList
          options={ethnicities}
          initialValue={edits?.ethnicity}
          onChange={(v) => update("ethnicity", v)}
        />

        {/* SEXUALITY */}

        <FieldLabel label="Sexuality" />

        <RadioList
          options={sexualities}
          initialValue={edits?.sexuality}
          onChange={(v) => update("sexuality", v)}
        />

        {/* ZODIAC */}

        <FieldLabel label="Zodiac" />

        <RadioList
          options={zodiacs}
          initialValue={edits?.zodiac}
          onChange={(v) => update("zodiac", v)}
        />

        {/* PETS */}

        <FieldLabel label="Pets" />

        <CheckboxList
          options={pets}
          initialSelection={edits?.pets || []}
          onChange={(v) => update("pets", v)}
        />

        {/* CHILDREN */}

        <FieldLabel label="Children" />

        <RadioList
          options={children}
          initialValue={edits?.children}
          onChange={(v) => update("children", v)}
        />

        {/* FAMILY PLANS */}

        <FieldLabel label="Family Plans" />

        <RadioList
          options={familyPlans}
          initialValue={edits?.family_plans}
          onChange={(v) => update("family_plans", v)}
        />

        {/* COVID */}

        <FieldLabel label="Covid Vaccine" />

        <RadioList
          options={covidVaccine}
          initialValue={edits?.covid_vaccine}
          onChange={(v) => update("covid_vaccine", v)}
        />
      </View>
    </StepLayout>
  );
}
