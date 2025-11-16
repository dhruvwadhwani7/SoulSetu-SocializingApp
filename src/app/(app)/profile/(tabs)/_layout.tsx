import { useMyProfile, useUpdateProfile } from "@/api/my-profile";
import { StackHeaderV3 } from "@/components/stack-header-v3";
import { MaterialTopTabs } from "@/layouts/material-top-tabs";
import { useEdit } from "@/store/edit";
import { router, Stack } from "expo-router";
import { isEqual } from "lodash";
import { Alert } from "react-native";
import colors from "tailwindcss/colors";

export default function Layout() {
  const { data: profile } = useMyProfile();
  const { edits, setEdits, gridActive } = useEdit();
  const { mutate } = useUpdateProfile();

  const handlePressCancel = async () => {
    if (isEqual(profile, edits)) {
      router.dismiss();
      return;
    }

    Alert.alert(
      "Discard Changes",
      "Are you sure you want to discard changes?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Discard",
          onPress: () => {
            setEdits(profile);
            router.dismiss();
          },
        },
      ]
    );
  };

  const handlePresDone = async () => {
    if (!edits) {
      Alert.alert("Error", "Something went wrong, please try again later");
      return;
    }

    if (isEqual(profile, edits)) {
      router.dismiss();
      return;
    }

    mutate(edits, {
      onSuccess: () => router.dismiss(),
      onError: () => {
        Alert.alert("Error", "Something went wrong, please try again later");
      },
    });
  };

  return (
    <>
      {/* iOS-style clean minimal header */}
      <StackHeaderV3
        title={edits?.first_name || ""}
        onPressCancel={handlePressCancel}
        onPressDone={handlePresDone}
        titleStyle={{
          fontSize: 19,
          fontWeight: "600",
          color: "#222",
          letterSpacing: 0.2,
        }}
        cancelLabelStyle={{
          color: "#7A7A7A", // iOS subtle grey
          fontSize: 15,
        }}
        doneLabelStyle={{
          color: "#5A3FE3", // SoulSetu purple (dark, minimal)
          fontSize: 15,
          fontWeight: "600",
        }}
        containerStyle={{
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 0.5,
          borderBottomColor: "#EAEAEA",
        }}
      />

      {/* Tabs */}
      <MaterialTopTabs
        screenOptions={{
          tabBarIndicatorStyle: {
            backgroundColor: "#5A3FE3", // refined purple
            height: 2.5,                // thin iOS underline
            borderRadius: 10,
          },
          tabBarStyle: {
            backgroundColor: "white",
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0.3,
            borderBottomColor: "#E4E4E4",
          },
          tabBarLabelStyle: {
            textTransform: "none",
            fontWeight: "600",
            fontSize: 14,
            letterSpacing: 0.2,
          },
          tabBarActiveTintColor: "#5A3FE3", // iOS purple
          tabBarInactiveTintColor: "#9F9F9F", // soft grey
          swipeEnabled: !gridActive,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Edit",
          }}
        />
        <Stack.Screen
          name="view"
          options={{
            title: "View",
          }}
        />
      </MaterialTopTabs>
    </>
  );
}
