import React, { useCallback, useRef } from "react";
import {
  AccessibilityRole,
  Animated,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  activeScale?: number;
  hitSlop?:
    | number
    | { top?: number; bottom?: number; left?: number; right?: number };
};

export default function Button_Pressable({
  title,
  onPress,
  disabled = false,
  accessibilityRole = "button",
  accessibilityLabel,
  testID,
  style,
  textStyle,
  activeScale = 0.97,
  hitSlop,
}: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: activeScale,
      useNativeDriver: true,
      friction: 7,
      tension: 50,
    }).start();
  }, [activeScale, scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 7,
      tension: 50,
    }).start();
  }, [scaleAnim]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel ?? title}
      testID={testID}
      hitSlop={hitSlop}
      android_ripple={{ color: "#00000010" }}
      style={{ opacity: disabled ? 0.6 : 1 }}
    >
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
        <Text selectable={false} style={textStyle}>
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
