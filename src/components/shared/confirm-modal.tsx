import { Modal, Pressable, Text, View } from "react-native";

type Props = {
  visible: boolean;
  title: string;
  subtitle: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
};

export default function ConfirmModal({
  visible,
  title,
  subtitle,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  danger,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 items-center justify-center px-6">
        <View
          className="w-full bg-white rounded-[32px] px-6 py-7"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.12,
            shadowRadius: 30,
            elevation: 10,
          }}
        >
          <Text
            className={`text-[22px] font-poppins-semibold text-center ${
              danger ? "text-red-600" : "text-[#111]"
            }`}
          >
            {title}
          </Text>

          <Text className="text-center text-[14px] text-neutral-500 mt-2 leading-relaxed">
            {subtitle}
          </Text>

          <View className="h-px bg-neutral-200/70 my-6" />

          <View className="flex-row gap-4">
            <Pressable
              className="flex-1 h-12 rounded-full bg-neutral-100 items-center justify-center"
              onPress={onCancel}
            >
              <Text className="font-poppins-medium text-neutral-700">
                {cancelText}
              </Text>
            </Pressable>

            <Pressable
              className={`flex-1 h-12 rounded-full items-center justify-center ${
                danger ? "bg-[#FEE2E2]" : "bg-[#FFF1F1]"
              }`}
              onPress={onConfirm}
            >
              <Text
                className={`font-poppins-semibold ${
                  danger ? "text-red-700" : "text-red-600"
                }`}
              >
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}