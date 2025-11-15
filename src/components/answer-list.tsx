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
          <View className="flex-1 rounded-md overflow-hidden border border-neutral-200 p-5">
            <Text className="text-base font-poppins-regular">
              {item.answer.question}
            </Text>
            <Text
              className="text-base font-poppins-regular text-neutral-400"
              numberOfLines={3}
            >
              {item.answer.answer_text}
            </Text>
          </View>
        ) : (
          <View className="flex-1 rounded-md border border-red-600 border-dashed" />
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
    <View>
      <View
        style={{
          width: width,
          alignSelf: "center",
        }}
      >
        <DraggableGrid
          numColumns={1}
          renderItem={renderItem}
          data={data}
          onDragRelease={onDragRelease}
          onDragItemActive={onDragItemActive}
          onItemPress={onItemPress}
          itemHeight={120}
        />
      </View>
    </View>
  );
};
