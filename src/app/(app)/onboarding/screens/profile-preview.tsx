import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { router } from "expo-router";

import { useEdit } from "@/store/edit";
import { useUpdateProfile } from "@/api/my-profile";

import { StepHeader, StepLayout } from "@/components/onboarding";
import { ProfileView } from "@/components/profileView/profile-view";

import { transformPrivateProfile } from "@/utils/profile/profile";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

export default function Page() {

  const { edits } = useEdit();

  const { mutateAsync, isPending } = useUpdateProfile();

  const [error, setError] = useState<string | null>(null);

  const isReady = Boolean(

    edits?.first_name?.trim() &&
    edits?.dob &&
    edits?.gender &&
    (edits?.photos?.length ?? 0) >= 3

  );

  const uploadImage = async (uri: string, userId: string) => {

    try {

      const response = await fetch(uri);

      const arrayBuffer = await response.arrayBuffer();

      const filePath =
        `${userId}/photos/${Date.now()}.jpg`;

      const { error } = await supabase.storage
        .from("profiles")
        .upload(filePath, arrayBuffer, {

          contentType: "image/jpeg",

        });

      if (error) throw error;

      return supabase.storage
        .from("profiles")
        .getPublicUrl(filePath)
        .data.publicUrl;

    }

    catch (e) {

      console.log("image upload failed", e);

      throw e;

    }

  };

  const handleFinish = async () => {

    if (!edits) return;

    try {

      console.log("uploading images");

      const uploadedPhotos = await Promise.all(

        edits.photos.map(async (p) => {

          if (p.photo_url.startsWith("file://")) {

            const newUrl = await uploadImage(

              p.photo_url,

              edits.id

            );

            return {

              ...p,

              photo_url: newUrl,

            };

          }

          return p;

        })

      );

      console.log("saving profile");

      await mutateAsync({

        ...edits,

        photos: uploadedPhotos,

        answers: edits.answers ?? [],

      });

      console.log("profile saved");

      router.replace("/(app)/(tabs)");

    }

    catch (e) {

      console.log("finish failed", e);

      setError("Upload failed");

    }

  };

  if (!edits) {

    return (

      <View className="flex-1 items-center justify-center">

        <Text>Preparing profile...</Text>

      </View>

    );

  }

  return (

    <StepLayout

      header={

        <StepHeader

          stepName="profile-preview"

          title="Preview profile"

          subtitle="Make sure everything looks right"

        />

      }

      footer={

        <View className="px-6 pb-10 pt-6 bg-white">

          <Pressable

            disabled={!isReady || isPending}

            onPress={handleFinish}

            className={`

              h-[54px]

              rounded-xl

              items-center

              justify-center

              ${!isReady || isPending

                ? "bg-neutral-300"

                : "bg-[#7454F6]"}

            `}

          >

            {

              isPending

              ?

              <ActivityIndicator color="white"/>

              :

              <Text className="text-white font-semibold text-[15px]">

                Finish

              </Text>

            }

          </Pressable>

          {

            error &&

            <Text className="text-red-500 text-xs mt-3 text-center">

              {error}

            </Text>

          }

        </View>

      }

    >

      <View className="flex-1">

        <ProfileView

          profile={transformPrivateProfile({

            ...edits,

            photos: edits.photos ?? [],

            answers: edits.answers ?? []

          })}

          myProfile

        />

      </View>

    </StepLayout>

  );

}