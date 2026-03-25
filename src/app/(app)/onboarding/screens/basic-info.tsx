import { useState } from "react";
import { View, TextInput, Text } from "react-native";
import { useEdit } from "@/store/edit";
import { PrivateProfile } from "@/api/my-profile/types";
import { FieldLabel, StepFooter, StepHeader, StepLayout } from "@/components/onboarding";

export default function Page() {
  const { edits, setEdits } = useEdit();

  const [errors, setErrors] = useState<any>({});

  const update = (field: string, value: any) => {
    setEdits({
      ...edits,

      [field]: value,
    } as PrivateProfile);
  };

  const validate = () => {
    const err: any = {};

    if (!edits?.first_name) {
      err.first_name = "Required";
    }

    if (!edits?.dob) {
      err.dob = "Required";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  return (
    <StepLayout
      header={
        <StepHeader
          stepName="basic-info"
          title="Basic Information"
          subtitle="Tell us about yourself"
        />
      }
      footer={
        <StepFooter
          nextRoute="/(app)/onboarding/identity-lifestyle"
          showSkip={false}
          disabled={!validate()}
        />
      }
    >
      <View className="mt-4">
        <FieldLabel label="First Name" required />

        <TextInput
          value={edits?.first_name || ""}
          onChangeText={(v) => update("first_name", v)}
          className="h-[52px] border border-neutral-200 rounded-xl px-3 mb-2"
        />

        {errors.first_name && (
          <Text className="text-red-500 text-xs mb-2">
            First name is required
          </Text>
        )}

        <FieldLabel label="Last Name" />

        <TextInput
          value={edits?.last_name || ""}
          onChangeText={(v) => update("last_name", v)}
          className="h-[52px] border border-neutral-200 rounded-xl px-3 mb-4"
        />

        <FieldLabel label="Date of Birth" required />

        <TextInput
          placeholder="YYYY-MM-DD"
          value={edits?.dob || ""}
          onChangeText={(v) => update("dob", v)}
          className="h-[52px] border border-neutral-200 rounded-xl px-3 mb-2"
        />

        {errors.dob && (
          <Text className="text-red-500 text-xs mb-2">
            Date of birth is required
          </Text>
        )}
      </View>
    </StepLayout>
  );
}
