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
  disabledDrag?: boolean;
  disabledReSorted?: boolean;
};

interface Props {
  profile: PrivateProfile;
  margin?: number;
  columns?: number;
  spacing?: number;
  slots?: number;
}

export const PhotoGrid: FC<Props> = ({
  profile,
  margin = 10,
  columns = 3,
  spacing = 10,
  slots = 6,
}) => {
  const containerWidth = Dimensions.get("window").width - margin * 2;
  const itemSize = containerWidth / columns - spacing;

  const [data, setData] = useState<Item[]>([]);
  const { setEdits, setGridActive } = useEdit();

  useEffect(() => {
    const initialData: Item[] = Array(slots)
      .fill(null)
      .map((_, index) => {
        const photo = profile?.photos?.[index] || null;
        return {
          key: index.toString(),
          photo,
          disabledDrag: !photo,
          disabledReSorted: !photo,
        };
      });
    setData(initialData);
  }, []);

  /* ---------- DELETE PHOTO ---------- */
  const deletePhoto = (item: Item) => {
    const updatedData = data.map((i) =>
      i.key === item.key
        ? {
            ...i,
            photo: null,
            disabledDrag: true,
            disabledReSorted: true,
          }
        : i
    );

    const updatedPhotos = updatedData
      .map((item, index) =>
        item.photo
          ? { ...item.photo, photo_order: index }
          : null
      )
      .filter(Boolean) as Photo[];

    setData(updatedData);
    setEdits({
      ...profile,
      photos: updatedPhotos,
    });
  };

  // DELETE MODAL CONFIRMATION

  const confirmDeletePhoto = (item: Item)=>{
    Alert.alert(
      "Remove Photo",
      "This photo will be removed from the profile",
      [
        { text : "Cancel", style : "cancel"},
        { text : "Delete" , style : "destructive", onPress : () => deletePhoto(item)}
      ]
      
    )
  }

  /* ---------- GRID ITEM ---------- */
  const renderItem = (item: Item, index: number) => {
  return (
    <View
      key={item.key}
      style={{
        height: itemSize,
        width: itemSize,
        borderRadius: 14,
        overflow: "hidden",
        position: "relative", // ✅ REQUIRED
        borderWidth: 2,
        borderColor: item.photo ? "#B8A4FF" : "#D7CCFF",
        backgroundColor: item.photo ? "#fff" : "#F7F3FF",
        shadowColor: "#7444FF",
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      {/* 🔢 ORDER NUMBER (only if photo exists) */}
      {item.photo && (
        <View
          style={{
            position: "absolute",
            top: 6,
            left: 6,
            height: 24,
            width: 24,
            margin : -2,
            borderRadius: 12,
            backgroundColor: "#7454F6",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
            elevation: 20,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 12,
              fontWeight: "600",
            }}
          >
            {index + 1}
          </Text>
        </View>
      )}

      {/* ❌ DELETE BUTTON */}
      {item.photo && (
        <Pressable
          onPress={() => confirmDeletePhoto(item)}
          hitSlop={12}
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            height: 24,
            width: 24,
            borderRadius: 12,
            backgroundColor: "rgba(0,0,0,0.7)",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
            elevation: 20,
          }}
        >
          <Ionicons name="close" size={14} color="#fff" />
        </Pressable>
      )}

      {/* 🖼 IMAGE OR EMPTY SLOT */}
      {item.photo?.photo_url ? (
        <Image
          source={item.photo.photo_url}
          style={{ flex: 1, borderRadius: 12 }}
          contentFit="cover"
        />
      ) : (
        <View
          style={{
            flex: 1,
            borderStyle: "dashed",
            borderColor: "#C8B5FF",
            borderWidth: 2,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(240,230,255,0.4)",
          }}
        >
          <Text
            style={{
              color: "#7B61FF",
              fontSize: 12,
              fontWeight: "500",
              opacity: 0.7,
            }}
          >
            Tap to upload
          </Text>
        </View>
      )}
    </View>
  );
};


  /* ---------- DRAG EVENTS ---------- */
  const onDragRelease = (newData: Item[]) => {
    const photos = newData
      .map((item, index) =>
        item.photo ? { ...item.photo, photo_order: index } : null
      )
      .filter(Boolean) as Photo[];

    setData(newData);
    setEdits({ ...profile, photos });
    setGridActive(false);
  };

  const onDragItemActive = () => setGridActive(true);

  const onItemPress = (item: Item) => {
    if (!item.photo) pickPhoto();
    else replacePhoto(item);
  };

  /* ---------- PICK PHOTO ---------- */
  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: slots - data.filter((i) => i.photo).length,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const updatedData = data.map((item, index) => {
        if (!item.photo && result.assets?.length) {
          const asset = result.assets.shift();
          if (asset) {
            return {
              ...item,
              photo: {
                id: "temp_" + Crypto.randomUUID(),
                photo_url: asset.uri,
                photo_order: index,
              },
              disabledDrag: false,
              disabledReSorted: false,
            };
          }
        }
        return item;
      });

      const photos = updatedData
        .map((item, index) =>
          item.photo ? { ...item.photo, photo_order: index } : null
        )
        .filter(Boolean) as Photo[];

      setData(updatedData);
      setEdits({ ...profile, photos });
    }
  };

  /* ---------- REPLACE PHOTO ---------- */
  const replacePhoto = async (item: Item) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      const asset = result.assets[0];

      const updatedData = data.map((i) =>
        i.key === item.key
          ? { ...i, photo: { ...i.photo!, photo_url: asset.uri } }
          : i
      );

      const photos = updatedData
        .map((item, index) =>
          item.photo ? { ...item.photo, photo_order: index } : null
        )
        .filter(Boolean) as Photo[];

      setData(updatedData);
      setEdits({ ...profile, photos });
    }
  };

  return (
    <View style={{ width: containerWidth, alignSelf: "center" }}>
      <DraggableGrid
        numColumns={columns}
        data={data}
        renderItem={renderItem}
        onDragRelease={onDragRelease}
        onDragItemActive={onDragItemActive}
        onItemPress={onItemPress}
      />
    </View>
  );
};