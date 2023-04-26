import { View, Pressable, Text, StyleSheet } from "react-native";
import React from "react";
import { ColorsPallet } from "../utils/Constants";

type Props = {
  handlePress: () => void;
  text: string;
  style?: StyleSheet.AbsoluteFillStyle;
  color?: string;
};

export default function BaseButton({ handlePress, text, style, color }: Props) {
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
        <Text style={styles.buttonText}>{text}</Text>
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
  buttonText: {
    color: ColorsPallet.darker,
  },
});
