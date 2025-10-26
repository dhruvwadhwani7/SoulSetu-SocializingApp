import Button_Pressable from "@/components/Button_Pressable";
import ArrowLeft from "@/components/icons/arrow_left";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmojiKeyboard, { EmojiType } from "rn-emoji-keyboard";

export default function Page() {
  const router = useRouter();

  // animated action text (right of ArrowLeft)
  const actionScale = useRef(new Animated.Value(1)).current;
  const onActionIn = () =>
    Animated.spring(actionScale, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 20,
      bounciness: 0,
    }).start();
  const onActionOut = () =>
    Animated.spring(actionScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();

  // plusBox press animation
  const plusScale = useRef(new Animated.Value(1)).current;
  const onPlusIn = () =>
    Animated.spring(plusScale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
      bounciness: 0,
    }).start();
  const onPlusOut = () =>
    Animated.spring(plusScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();

  // emoji picker state
  const [emojiModalVisible, setEmojiModalVisible] = useState(false);
  const [emojis, setEmojis] = useState<string[]>(["", "", ""]);

  const openEmojiModal = () => setEmojiModalVisible(true);
  const closeEmojiModal = () => setEmojiModalVisible(false);

  const handleEmojiSelect = (item: EmojiType) => {
    const val = item.emoji;
    setEmojis((prev) => {
      const next = [...prev];
      const idx = next.findIndex((x) => !x);
      if (idx !== -1) next[idx] = val;
      else next[2] = val;
      // close when all three chosen
      const allSet = next.every((x) => x && x.length > 0);
      if (allSet) closeEmojiModal();
      return next;
    });
  };

  const clearEmoji = (index: number) =>
    setEmojis((prev) => {
      const next = [...prev];
      next[index] = "";
      return next;
    });

  const handleNext = () => {
    console.log("Step 4 ---> Next pressed");
    console.log("Selected emojis:", emojis);
    router.push("/(app)/(auth)/signup/step5");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainView}>
        {/* header with back and action */}
        <View style={styles.headerRow}>
          <ArrowLeft
            style={styles.arrowIcon}
            width={16}
            height={16}
            fill="black"
          />
          <Pressable
            onPress={() => {
              console.log("Skip pressed");
              router.push("/(app)/(auth)/signup/step5");
            }}
            onPressIn={onActionIn}
            onPressOut={onActionOut}
            accessibilityRole="button"
          >
            <Animated.Text
              style={[
                styles.headerActionText,
                { transform: [{ scale: actionScale }] },
              ]}
            >
              Skip
            </Animated.Text>
          </Pressable>
        </View>

        <Text style={styles.heading}>{"Express Your Self With Emojis"}</Text>

        {/* Add Emoji Card (stacked with shadows) */}
        <View style={styles.cardStackWrapper} pointerEvents="box-none">
          {/* back-most card */}
          <View style={[styles.cardBase, styles.cardBack3]} />
          {/* middle card */}
          <View style={[styles.cardBase, styles.cardBack2]} />
          {/* front card */}
          <View style={[styles.cardBase, styles.cardFront]}>
            <Text style={styles.cardLabel}>Add Emojis</Text>

            {/* Pressable + animated Plus Card */}
            <Animated.View
              style={[styles.plusBox, { transform: [{ scale: plusScale }] }]}
            >
              <Pressable
                onPressIn={onPlusIn}
                onPressOut={onPlusOut}
                onPress={openEmojiModal}
                accessibilityRole="button"
                style={styles.plusPressable}
              >
                <Text style={styles.plus}>+</Text>
              </Pressable>
            </Animated.View>
          </View>
        </View>

        {/* Selected emojis row */}
        <View style={styles.emojisRow}>
          <Pressable style={styles.emojiItem} onPress={() => clearEmoji(0)}>
            {emojis[0] ? (
              <View style={styles.crossBadge} pointerEvents="none">
                <Text style={styles.crossText}>×</Text>
              </View>
            ) : null}
            <Text style={styles.emojiTxt}>{emojis[0]}</Text>
          </Pressable>
          <Pressable style={styles.emojiItem} onPress={() => clearEmoji(1)}>
            {emojis[1] ? (
              <View style={styles.crossBadge} pointerEvents="none">
                <Text style={styles.crossText}>×</Text>
              </View>
            ) : null}
            <Text style={styles.emojiTxt}>{emojis[1]}</Text>
          </Pressable>
          <Pressable style={styles.emojiItem} onPress={() => clearEmoji(2)}>
            {emojis[2] ? (
              <View style={styles.crossBadge} pointerEvents="none">
                <Text style={styles.crossText}>×</Text>
              </View>
            ) : null}
            <Text style={styles.emojiTxt}>{emojis[2]}</Text>
          </Pressable>
        </View>

        {/* Emoji keyboard (emoji-only) */}
        <EmojiKeyboard
          open={emojiModalVisible}
          onClose={closeEmojiModal}
          onEmojiSelected={handleEmojiSelect}
          enableSearchBar={false}
          categoryPosition="bottom"
        />

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

  /* ===== Add Emoji Card styles (updated) ===== */
  cardStackWrapper: {
    width: "80%",
    alignSelf: "center",
    height: 320, // room for layered offsets
    marginBottom: 18,
  },
  cardBase: {
    position: "absolute",
    height: 300,
    borderRadius: 14,

    // cross-platform shadow
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  cardFront: {
    backgroundColor: "#D9D9D9", // Front Card
    left: 0,
    right: 0, // fill wrapper width
    top: 0,
    padding: 16,
    zIndex: 3,
  },
  cardBack2: {
    backgroundColor: "#B5B2B2", // Middle Card
    width: "92%",
    height: 280,
    right: -12, // peek on the right
    top: 10,
    zIndex: 1,
  },
  cardBack3: {
    backgroundColor: "#827C7C", // Back Most Card
    width: "85%",
    height: 260,
    right: -24, // peek further on the right
    top: 20,
    zIndex: 0,
  },
  cardLabel: {
    color: "#050505",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 30,
  },
  plusBox: {
    position: "absolute",
    bottom: 40,
    right: 40,
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: "#A9A9A9", // Plus Card
    alignItems: "center",
    justifyContent: "center",

    // subtle shadow for the plus card
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  plus: {
    fontSize: 22,
    color: "#000000",
  },

  /* ===== New: pressable wrapper inside plus box ===== */
  plusPressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },

  /* ===== New: emojis row below the stack ===== */
  emojisRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  emojiItem: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
    position: "relative", // allow cross badge positioning
  },
  emojiTxt: {
    fontSize: 20,
  },

  /* ===== New: modal styles ===== */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    // shadow
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },
  emojiInputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  emojiInput: {
    width: 56,
    height: 56,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E3EE3E3",
    textAlign: "center",
    fontSize: 28,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  modalBtnText: {
    fontSize: 14,
    color: "#111",
    fontWeight: "600",
  },

  arrowIcon: {
    width: 16,
    height: 16,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
  mainView: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 23,
    paddingTop: 67,
    marginBottom: 24,
  },
  headerActionText: {
    color: "red",
    fontSize: 14,
    fontWeight: "600",
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
  bioInput: {
    borderRadius: 10, // more square corners
    minHeight: 300, // taller to be more square-like
  },

  // small red cross badge
  crossBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FF3B30",
    alignItems: "center",
    justifyContent: "center",
  },
  crossText: {
    color: "#FF3B30",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 12,
  },
});
