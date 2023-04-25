import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { ColorsPallet } from "../../../utils/Constants";
import BaseButton from "../../../components/BaseButton";

type Props = {
  strengthLevel: Number;
  handleChooseStrengthLevel: () => {};
};

export default function BotStrengthOption({ strengthLevel }: Props) {
  return (
    <View style={styles.container}>
      <BaseButton
        text={strengthLevel.toString()}
        handlePress={() => strengthLevel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ColorsPallet.baseColor,
    borderColor: ColorsPallet.darker,
    borderWidth: 2,
    borderRadius: 8,
  },
  text: {
    color: ColorsPallet.darker,
    fontWeight: "700",
  },
});
