import { Photo, PrivateProfile } from "@/api/my-profile/types";

import { useEdit } from "@/store/edit";

import * as Crypto from "expo-crypto";

import { Image } from "expo-image";

import * as ImagePicker from "expo-image-picker";

import { FC, useEffect, useState } from "react";

import { Dimensions, View, Text, Pressable, Alert } from "react-native";

import { DraggableGrid } from "react-native-draggable-grid";

import { Ionicons } from "@expo/vector-icons";

type Item = {
  key: string;

  photo: Photo | null;
};

interface Props {
  slots?: number;

  columns?: number;
}

export const OnboardingPhotoGrid: FC<Props> = ({
  slots = 6,

  columns = 3,
}) => {
  const { edits, setEdits, setGridActive } = useEdit();

  const [data, setData] = useState<Item[]>([]);

  const containerWidth = Dimensions.get("window").width - 32;

  const itemSize = containerWidth / columns - 8;

  /* initialize grid */

  useEffect(() => {
    const initialData: Item[] = Array(slots)
      .fill(null)

      .map((_, index) => ({
        key: index.toString(),

        photo: edits?.photos?.[index] ?? null,
      }));

    setData(initialData);
  }, []);

  /* helper */

  const updatePhotos = (items: Item[]) => {
    const photos = items
      .map((item, index) =>
        item.photo
          ? {
              ...item.photo,
              photo_order: index,
            }
          : null,
      )
      .filter(Boolean) as Photo[];

    setData(items);

    setEdits({
      ...edits!,

      photos,

      avatar_url: photos?.[0]?.photo_url ?? edits?.avatar_url,
    });
  };
  /* delete */

  const confirmDelete = (item: Item) => {
    Alert.alert(
      "Remove photo",

      "This photo will be deleted",

      [
        { text: "Cancel", style: "cancel" },

        {
          text: "Delete",

          style: "destructive",

          onPress: () => {
            const updated = data.map((i) =>
              i.key === item.key ? { ...i, photo: null } : i,
            );

            updatePhotos(updated);
          },
        },
      ],
    );
  };

  /* pick */

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],

      allowsMultipleSelection: true,

      selectionLimit: slots - data.filter((i) => i.photo).length,

      quality: 1,
    });

    if (result.canceled) return;

    const updated = [...data];

    result.assets.forEach((asset) => {
      const emptyIndex = updated.findIndex((i) => !i.photo);

      if (emptyIndex === -1) return;

      updated[emptyIndex] = {
        key: updated[emptyIndex].key,

        photo: {
          id: "temp_" + Crypto.randomUUID(),

          photo_url: asset.uri,

          photo_order: emptyIndex,
        },
      };
    });

    updatePhotos(updated);
  };

  /* replace */

  const replacePhoto = async (item: Item) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],

      allowsEditing: true,

      quality: 1,
    });

    if (result.canceled) return;

    const updated = data.map((i) =>
      i.key === item.key
        ? {
            ...i,

            photo: {
              ...i.photo!,

              photo_url: result.assets[0].uri,
            },
          }
        : i,
    );

    updatePhotos(updated);
  };

  /* drag */

  const onDragRelease = (newData: Item[]) => {
    updatePhotos(newData);

    setGridActive(false);
  };

  const onDragStart = () => setGridActive(true);

  const onItemPress = (item: Item) => {
    if (!item.photo) pickPhoto();
    else replacePhoto(item);
  };

  /* render */

  const renderItem = (item: Item, index: number) => (
    <View
      style={{
        width: itemSize,

        height: itemSize,

        borderRadius: 14,

        overflow: "hidden",

        borderWidth: 2,

        borderColor: item.photo ? "#B8A4FF" : "#E5DFFF",

        backgroundColor: "#F9F7FF",
      }}
    >
      {item.photo ? (
        <Image
          source={item.photo.photo_url}
          style={{ flex: 1 }}
          contentFit="cover"
        />
      ) : (
        <View
          style={{
            flex: 1,

            justifyContent: "center",

            alignItems: "center",
          }}
        >
          <Text className="text-xs text-neutral-400">Upload</Text>
        </View>
      )}

      {/* delete */}

      {item.photo && (
        <Pressable
          onPress={() => confirmDelete(item)}
          style={{
            position: "absolute",

            top: 6,

            right: 6,

            backgroundColor: "rgba(0,0,0,0.7)",

            borderRadius: 10,

            padding: 3,
          }}
        >
          <Ionicons name="close" size={12} color="white" />
        </Pressable>
      )}

      {/* order */}

      {item.photo && (
        <View
          style={{
            position: "absolute",

            top: 6,

            left: 6,

            backgroundColor: "#7454F6",

            borderRadius: 10,

            paddingHorizontal: 6,

            paddingVertical: 2,
          }}
        >
          <Text className="text-white text-xs">{index + 1}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={{ alignSelf: "center" }}>
      <DraggableGrid
        numColumns={columns}
        data={data}
        renderItem={renderItem}
        onDragRelease={onDragRelease}
        onDragItemActive={onDragStart}
        onItemPress={onItemPress}
      />
    </View>
  );
};
