import { Answer, PrivateProfile } from "@/api/my-profile/types";
import { useEdit } from "@/store/edit";
import { router } from "expo-router";
import { FC, useEffect, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { DraggableGrid } from "react-native-draggable-grid";

type Item = {
  key: string;
  answer: Answer;
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
  spacing = 10,
  margin = 10,
  height = 120,
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
            answer: answer,
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
          answer: answer,
          disabledDrag: answer === null,
          disabledReSorted: answer === null,
        };
      });
      setData(newData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const renderItem = (item: Item) => {
    return (
      <View
        style={{
          width: size,
          height: height,
          paddingVertical: spacing / 2,
        }}
        key={item.key}
      >
        {item.answer ? (
          <View
            style={{
              flex: 1,
              padding: 16,
              borderRadius: 18,
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#E8E8E8",
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 4 },
              elevation: 1,
              justifyContent: "center",
            }}
          >
            {/* PROMPT QUESTION */}
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#1A1A1A",
                marginBottom: 6,
              }}
            >
              {item.answer.question}
            </Text>

            {/* USER ANSWER */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
                color: "#6A6A6A",
                lineHeight: 18,
              }}
              numberOfLines={3}
            >
              {item.answer.answer_text}
            </Text>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              borderRadius: 18,
              borderWidth: 1.25,
              borderStyle: "dashed",
              borderColor: "#D7D0FF",
              backgroundColor: "#FBFAFF",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#7B61FF",
                fontSize: 14,
                fontWeight: "500",
                opacity: 0.7,
              }}
            >
              Tap to add answer
            </Text>
          </View>
        )}
      </View>
    );
  };

  const onDragRelease = (data: Item[]) => {
    const answers = data
      .map((item, index) => {
        return {
          ...item.answer,
          answer_order: index,
        };
      })
      .filter((item) => item.answer_text != null);

    setMyProfileChanges({
      ...profile,
      answers,
    });
    setData(data);
    setGridActive(false);
  };

  const onDragItemActive = () => {
    setGridActive(true);
  };

  const onItemPress = (item: Item) => {
    if (item.answer) {
      router.push({
        pathname: "/(app)/write-answer",
        params: {
          itemId: item.answer.id,
          promptId: item.answer.prompt_id,
        },
      });
    } else {
      router.push("/(app)/prompts");
    }
    return;
  };

  return (
  <View
    style={{
      width: width,
      alignSelf: "center",
      paddingTop: 4,       // small spacing for air
      paddingBottom: 12,   // room under grid
    }}
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
