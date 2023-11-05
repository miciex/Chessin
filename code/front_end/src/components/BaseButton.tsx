import { View, Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import React, { ReactNode } from "react";
import { ColorsPallet } from "../utils/Constants";

type Props = {
  handlePress: () => void;
  text: string ;
  style?: ViewStyle;
  color?: string;
  fontSizeProps?: number;
  fontColor?: string;
  element?: ReactNode;
};
//text chce wiekszy
export default function BaseButton({
  handlePress,
  text,
  style,
  color,
  fontSizeProps,
  fontColor,
  element
}: Props) {
  if (!fontSizeProps) fontSizeProps = 16;

  return (
    <View style={style != null ? style : styles.buttonContainer}>
      <Pressable
        onPress={handlePress}
        style={{
          ...styles.button,
          backgroundColor: color != null ? color : ColorsPallet.baseColor,
        }}
        android_ripple={{ color: ColorsPallet.darker, borderless: false }}
      >
          {element? element :(<Text
            style={{
              fontSize: fontSizeProps,
              color: fontColor ? fontColor : ColorsPallet.darker,
            }}
          >
            {text}
        </Text>)}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 8,
    flexDirection: "row",
  },
  button: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
