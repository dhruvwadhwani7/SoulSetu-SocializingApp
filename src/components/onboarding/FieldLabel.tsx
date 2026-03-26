import { Text } from "react-native";

export default function FieldLabel({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <Text className="text-[14px] font-medium text-neutral-800 mb-1">
      {label}

      {required && <Text className="text-red-500"> *</Text>}
    </Text>
  );
}
