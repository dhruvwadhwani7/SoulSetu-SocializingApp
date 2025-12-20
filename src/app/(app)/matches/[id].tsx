import { useUnmatch } from "@/api/profiles";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { useGroupChannel } from "@sendbird/uikit-chat-hooks";
import {
  createGroupChannelFragment,
  GroupChannelContexts,
  useSendbirdChat,
} from "@sendbird/uikit-react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { Alert, Pressable, Text, View } from "react-native";

const CustomHeader = () => {
  const { headerTitle } = useContext(GroupChannelContexts.Fragment);
  const { mutate } = useUnmatch();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Stack.Screen
      options={{
        headerLeft: () => (
          <View className="flex-row items-center gap-2">
            <Pressable onPressOut={() => router.back()}>
              <Ionicons
                name="chevron-back"
                className="text-2xl"
                suppressHighlighting
              />
            </Pressable>

            <Text className="text-lg font-poppins-medium">{headerTitle}</Text>
          </View>
        ),
        title: "",
        headerRight: () => (
          <Pressable
            onPressOut={() => {
              Alert.alert(
                "Are you sure?",
                `Unmatching will delete the match for both you and ${headerTitle}`,
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Unmatch",
                    onPress: () => {
                      mutate(id, {
                        onSuccess: () => {
                          router.navigate("/matches/");
                        },
                        onError: () => {
                          Alert.alert(
                            "Error",
                            "Something went wrong, please try again later."
                          );
                        },
                      });
                    },
                  },
                ]
              );
            }}
          >
            <Ionicons
              name="cut-outline"
              className="text-2xl"
              suppressHighlighting
            />
          </Pressable>
        ),
      }}
    />
  );
};

const GroupChannelFragment = createGroupChannelFragment({
  Header: CustomHeader,
});

export default function Page() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const height = useHeaderHeight();

  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, id);
  if (!channel) return null;

  return (
    <GroupChannelFragment
      channel={channel}
      onChannelDeleted={() => {
        router.navigate("/matches");
      }}
      onPressHeaderLeft={() => {
        router.back();
      }}
      onPressHeaderRight={() => {}}
      keyboardAvoidOffset={height}
    />
  );
}
