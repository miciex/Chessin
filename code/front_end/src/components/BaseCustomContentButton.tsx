import { View, StyleSheet, Pressable } from "react-native";
import React from "react";
import { ColorsPallet } from "../utils/Constants";

type Props = {
  content: React.ReactNode;
  handlePress: () => void | Function;
};

const BaseCustomContentButton: React.FC<Props> = ({ handlePress, content }) => {
  return (
    <View style={{ ...styles.buttonContainer }}>
      <Pressable
        onPress={handlePress}
        style={styles.button}
        android_ripple={{ color: ColorsPallet.darker, borderless: false }}
      >
        {content}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    flexDirection: "row",
  },
  button: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: ColorsPallet.darker,
  },
});

export default BaseCustomContentButton;
