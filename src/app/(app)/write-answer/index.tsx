import { Answer } from "@/api/my-profile/types";
import { usePrompts } from "@/api/options";
import { Prompt } from "@/api/options/types";
import { StackHeaderV3 } from "@/components/shared/stack-header-v3";
import { useEdit } from "@/store/edit";
import * as Crypto from "expo-crypto";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import colors from "tailwindcss/colors";

export default function Page() {
  const { data: prompts } = usePrompts();
  const { promptId, itemId } = useLocalSearchParams();

  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [text, setText] = useState("");

  const { edits, setEdits } = useEdit();

  useEffect(() => {
    const prompt = prompts.find((item) => item.id.toString() === promptId);
    setPrompt(prompt || null);

    if (itemId) {
      const answer = edits?.answers?.find((item: Answer) => item.id === itemId);
      setText(answer?.answer_text || "");
    }
  }, [prompts, promptId, itemId, edits]);

  const handlePressCancel = () => {
    router.dismissTo("/(app)/profile/(tabs)");
  };

  const handlePressDone = () => {
    if (!edits || !prompt?.id || !prompt?.question) return;

    if (itemId) {
      const updatedAnswers: Answer[] = edits.answers.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            answer_text: text,
            prompt_id: prompt.id,
            question: prompt.question,
          };
        }
        return item;
      });

      setEdits({ ...edits, answers: updatedAnswers });
    } else {
      if (!text) return;

      const newAnswer: Answer = {
        id: "temp_" + Crypto.randomUUID(),
        answer_text: text,
        answer_order: edits.answers.length,
        prompt_id: prompt.id,
        question: prompt.question,
      };

      setEdits({
        ...edits,
        answers: [...edits.answers, newAnswer],
      });
    }

    router.dismissTo("/(app)/profile/(tabs)");
  };

  return (
    <View className="flex-1 bg-[#FAFAFB] px-5">
      <StackHeaderV3
        title="Write answer"
        onPressCancel={handlePressCancel}
        onPressDone={handlePressDone}
      />

      <View className="gap-6 mt-4">
        {/* ===== PROMPT ===== */}
        <View>
          <Text className="text-[11px] font-poppins-semibold text-neutral-400 tracking-widest mb-2">
            PROMPT
          </Text>

          <Link
            href={{ pathname: "/prompts", params: { itemId } }}
            asChild
            suppressHighlighting
          >
            <Pressable
              className="bg-white rounded-2xl px-5 py-5 border border-neutral-200"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.04,
                shadowRadius: 10,
                elevation: 2,
              }}
            >
              <Text className="text-[16px] font-poppins-medium text-[#111] leading-snug">
                {prompt?.question || "Choose a prompt"}
              </Text>

              <Text className="text-[12px] text-neutral-500 mt-3">
                Tap to change prompt
              </Text>
            </Pressable>
          </Link>
        </View>

        {/* ===== ANSWER ===== */}
        <View>
          <Text className="text-[11px] font-poppins-semibold text-neutral-400 tracking-widest mb-2">
            YOUR ANSWER
          </Text>

          <View
            className="bg-white rounded-2xl border border-neutral-200 px-5 py-4"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.04,
              shadowRadius: 10,
              elevation: 2,
            }}
          >
            <TextInput
              className="text-[15px] text-[#111]"
              placeholder="Write your answer here…"
              placeholderTextColor={colors.neutral[400]}
              multiline
              numberOfLines={6}
              maxLength={255}
              selectionColor={colors.black}
              value={text}
              onChangeText={setText}
              style={{ minHeight: 140, textAlignVertical: "top" }}
            />

            <Text className="text-[12px] text-neutral-400 mt-3 text-right">
              {text.length}/255
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
