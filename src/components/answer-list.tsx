import { Answer, PrivateProfile } from "@/api/my-profile/types";
import { useEdit } from "@/store/edit";
import { router } from "expo-router";
import { FC, useEffect, useState } from "react";
import { Dimensions, Text, View, Pressable, Alert } from "react-native";
import { DraggableGrid } from "react-native-draggable-grid";
import { Ionicons } from "@expo/vector-icons";

type Item = {
  key: string;
  answer: Answer | null;
  disabledDrag?: boolean;
  disabledReSorted?: boolean;
};

interface Props {
  profile: PrivateProfile;
  columns?: number;
  spacing?: number;
  margin?: number;
  height?: number;
  slots?: number;
}
export const AnswerList: FC<Props> = ({
  profile,
  columns = 1,
  spacing = 12,
  margin = 16,
  height = 130,
  slots = 3,
}) => {
  const width = Dimensions.get("window").width - margin * 2;
  const size = width / columns - spacing;

  const [data, setData] = useState<Item[]>([]);
  const { setEdits: setMyProfileChanges, setGridActive } = useEdit();

  useEffect(() => {
    if (!data.length) {
      const initialData: Item[] = Array(slots)
        .fill(null)
        .map((_, index) => {
          const answer = profile?.answers[index] || null;
          return {
            key: index.toString(),
            answer,
            disabledDrag: answer === null,
            disabledReSorted: answer === null,
          };
        });
      setData(initialData);
    } else {
      const newData = data.map((item, index) => {
        const answer = profile?.answers[index] || null;
        return {
          ...item,
          answer,
          disabledDrag: answer === null,
          disabledReSorted: answer === null,
        };
      });
      setData(newData);
    }
  }, [profile, slots]);

  const confirmDeleteAnswer = (item: Item) => {
    Alert.alert(
      "Remove Prompt",
      "This prompt will be removed from the profile",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteAnswer(item),
        },
      ]
    );
  };

  const deleteAnswer = (item: Item) => {
    const updatedData = data.map((i) =>
      i.key === item.key
        ? {
            ...i,
            answer: null,
            disabledDrag: true,
            disabledReSorted: true,
          }
        : i
    );

    const updatedAnswers = updatedData
      .map((item, index) =>
        item.answer
          ? {
              ...item.answer,
              answer_order: index,
            }
          : null
      )
      .filter(Boolean) as Answer[];

    setData(updatedData);
    setMyProfileChanges({
      ...profile,
      answers: updatedAnswers,
    });
  };

 const renderItem = (item: Item, index: number) => {
  return (
    <View
      style={{ width: size, height, paddingVertical: spacing / 2 }}
      key={item.key}
    >
      {item.answer ? (
        <View
          style={{
            flex: 1,
            padding: 18,
            borderRadius: 22,
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#EEEAFD",
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 2,
            justifyContent: "center",
          }}
        >
          {/* Order number */}
          <View
            style={{
              position: "absolute",
              top: 6,
              left: 6,
              height: 24,
              width: 24,
              margin : -12,
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

          {/* Delete */}
          <Pressable
            onPress={() => confirmDeleteAnswer(item)}
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
            hitSlop={10}
          >
            <Ionicons name="close" size={14} color="#fff" />
          </Pressable>

          {/* Question */}
          <Text
            style={{
              fontSize: 15,
              fontWeight: "600",
              color: "#1A1A1A",
              marginBottom: 6,
              letterSpacing: 0.2,
            }}
            numberOfLines={2}
          >
            {item.answer.question}
          </Text>

          {/* Answer */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: "400",
              color: "#6B6B6B",
              lineHeight: 20,
            }}
            numberOfLines={3}
          >
            {item.answer.answer_text}
          </Text>
        </View>
      ) : (
        // empty state unchanged
        <View
          style={{
            flex: 1,
            borderRadius: 22,
            borderWidth: 1.5,
            borderStyle: "dashed",
            borderColor: "#D6CBFF",
            backgroundColor: "#FBFAFF",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#7454F6",
              fontSize: 14,
              fontWeight: "500",
              opacity: 0.75,
              letterSpacing: 0.3,
            }}
          >
            Add an answer
          </Text>
        </View>
      )}
    </View>
  );
};


  const onDragRelease = (data: Item[]) => {
    const answers = data
      .map((item, index) =>
        item.answer ? { ...item.answer, answer_order: index } : null
      )
      .filter(Boolean) as Answer[];

    setMyProfileChanges({ ...profile, answers });
    setData(data);
    setGridActive(false);
  };

  const onDragItemActive = () => setGridActive(true);

  const onItemPress = (item: Item) => {
    if (item.answer) {
      router.push({
        pathname: "/(app)/write-answer",
        params: { itemId: item.answer.id, promptId: item.answer.prompt_id },
      });
    } else {
      router.push("/(app)/prompts");
    }
  };

  return (
    <View
      style={{ width, alignSelf: "center", paddingTop: 6, paddingBottom: 14 }}
    >
      <DraggableGrid
        numColumns={1}
        renderItem={renderItem}
        data={data}
        onDragRelease={onDragRelease}
        onDragItemActive={onDragItemActive}
        onItemPress={onItemPress}
        itemHeight={height}
      />
    </View>
  );
};
