import { View, Pressable, Text, StyleSheet } from "react-native";
import React from "react";
import { ColorsPallet } from "../utils/Constants";

type Props = {
  handlePress: () => void;
  text: string;
};

export default function BaseButton({ handlePress, text }: Props) {
  return (
    <View style={styles.buttonContainer}>
      <Pressable onPress={handlePress} style={styles.button}>
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
    backgroundColor: ColorsPallet.baseColor,
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  buttonText: {
    color: ColorsPallet.darker,
  },
});
