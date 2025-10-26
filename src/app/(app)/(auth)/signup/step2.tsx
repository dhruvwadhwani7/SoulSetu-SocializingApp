import Camera from "@/components/assets/Camera";
import Button_Pressable from "@/components/Button_Pressable";
import ArrowLeft from "@/components/icons/arrow_left";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native"; // added Pressable
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const router = useRouter();

  // holds selected image for logging (as requested: useRef)
  const selectedImageRef = useRef<string | null>(null);
  // state used to display image in UI
  const [mainImageUri, setMainImageUri] = useState<string | null>(null);

  // new: 6 grid images state + ref
  const [gridImages, setGridImages] = useState<(string | null)[]>(
    Array(6).fill(null)
  );
  const gridImagesRef = useRef<(string | null)[]>(Array(6).fill(null));

  const setGridImageAt = (index: number, uri: string | null) => {
    setGridImages((prev) => {
      const next = [...prev];
      next[index] = uri;
      gridImagesRef.current = next;
      return next;
    });
  };

  const renderTile = (index: number) => {
    const uri = gridImages[index];
    return (
      <View key={index} style={styles.imageRowView}>
        <View style={styles.imageTile}>
          {uri ? (
            <Image
              source={{ uri }}
              style={styles.gridImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.emptyImageFiller} />
          )}
          {/* Use Camera to open picker for this slot */}
          {!uri && (
            <Camera
              style={styles.tileCameraOverlay}
              onPick={(picked) => setGridImageAt(index, picked)}
            />
          )}
          {uri ? (
            <Pressable
              onPress={() => setGridImageAt(index, null)}
              style={styles.deleteBadge}
              accessibilityRole="button"
            >
              <Text style={styles.deleteText}>×</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    );
  };

  const handleNext = () => {
    console.log("Step 2 ---> Next pressed", {
      selectedImage: selectedImageRef.current,
      gridImages: gridImagesRef.current, // log all 6
    });
    router.push("/(app)/(auth)/signup/step3");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainView}>
        {/* replaced Image with ArrowLeft component */}
        <ArrowLeft
          style={styles.arrowIcon}
          width={16}
          height={16}
          fill="black"
        />

        <Text style={styles.heading}>{"Photos"}</Text>
        <View>
          <View style={styles.mainImageView}>
            {/* Camera button pinned to top-right */}
            <Camera
              style={styles.topRightImage}
              onPick={(uri) => {
                selectedImageRef.current = uri;
                setMainImageUri(uri);
              }}
            />
            {/* Main image covers the whole container */}
            <Image
              source={
                mainImageUri
                  ? { uri: mainImageUri }
                  : require("../../../../../assets/images/Sample-Image.jpg")
              }
              resizeMode={"cover"}
              style={styles.mainImage}
            />
          </View>

          {/* grid rows */}
          <View style={styles.imageRow}>{[0, 1, 2].map(renderTile)}</View>
          <View style={styles.imageRow}>{[3, 4, 5].map(renderTile)}</View>
        </View>

        {/* bottom fixed block */}
        <View style={styles.bottomContainerPointer} pointerEvents="box-none">
          <View style={{ alignItems: "center" }}>
            <Button_Pressable
              onPress={handleNext}
              title="Next"
              accessibilityRole="button"
              style={styles.button}
              textStyle={styles.buttonText}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  arrowIcon: {
    width: 16,
    height: 16,
    marginTop: 67,
    marginBottom: 58,
    marginLeft: 23,
  },
  mainView: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  mainImageView: {
    // changed: make container clip children and provide stable height
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#D9D9D9",
    borderRadius: 14,
    marginBottom: 15,
    marginHorizontal: 39,
    // you can tweak these
    height: 260, // ensures the container has space for the cover image
  },
  // new: small image in top-right corner
  topRightImage: {
    // same anchored style, applied to the Camera's outer container
    zIndex: 1,
    position: "absolute",
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#989696",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D9D9D9",
  },
  // changed: main image now covers the container
  mainImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 11,
    alignSelf: "center",
  },
  imageRowView: {
    backgroundColor: "#D9D9D9",
    borderRadius: 6,
    paddingTop: 8,
    paddingBottom: 7,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  emptyImageFiller: {
    width: 70,
    height: 70,
    backgroundColor: "#8F8F8F",
    borderRadius: 10,
  },
  // new: tile container with clipping and overlays
  imageTile: {
    width: 70,
    height: 70,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#8F8F8F",
  },
  // new: the picked image covers the tile
  gridImage: {
    width: "100%",
    height: "100%",
  },
  // new: Camera overlay fills the tile so entire tile is tappable to pick
  tileCameraOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  // new: delete button for a picked image
  deleteBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700",
  },
  heading: {
    color: "#050505",
    fontSize: 20,
    marginBottom: 27,
    marginLeft: 23,
    fontWeight: "700",
  },
  text: {
    color: "#5C5B5B",
    fontSize: 10,
    marginBottom: 17,
  },
  buttonText: {
    color: "#5C5B5B",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#E6E6E6",
    borderRadius: 10,
    paddingTop: 12,
    paddingBottom: 11,
    paddingHorizontal: 75,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainerPointer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: "center",
  },
});
