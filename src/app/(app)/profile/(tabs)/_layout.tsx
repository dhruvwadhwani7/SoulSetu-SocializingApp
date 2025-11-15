import { useMyProfile } from "@/api/my-profile";
import { StackHeaderV3 } from "@/components/stack-header-v3";
import { MaterialTopTabs } from "@/layouts/material-top-tabs";
import { useEdit } from "@/store/edit";
import { router, Stack } from "expo-router";
// import { isEqual } from "lodash";
// import { Alert } from "react-native";
import colors from "tailwindcss/colors";

export default function Layout() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: profile } = useMyProfile();
  const { edits, setEdits, gridActive } = useEdit();
  // const { mutate } = useUpdateProfile();

  const handlePressCancel = async () => {
    router.dismiss();
  };

  const handlePresDone = async () => {
    router.dismiss();
  };
  return (
    <>
      <StackHeaderV3
        title={edits?.first_name || ""}
        onPressCancel={handlePressCancel}
        onPressDone={handlePresDone}
      />
      <MaterialTopTabs
        screenOptions={{
          tabBarIndicatorStyle: {
            backgroundColor: colors.fuchsia[900],
          },
          tabBarLabelStyle: {
            textTransform: "capitalize",
            fontWeight: "bold",
            fontSize: 13,
          },
          tabBarActiveTintColor: colors.fuchsia[900],
          tabBarInactiveTintColor: colors.neutral[300],
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
