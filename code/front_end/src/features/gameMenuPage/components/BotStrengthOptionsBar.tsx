import { View, Text, StyleSheet } from "react-native";
import React from "react";
import BotStrengthOption from "./BotStrengthOption";

type Props = {
  strengthLevelsArray: Array<Number>;
};

export default function BotStrengthOptionsBar({ strengthLevelsArray }: Props) {
  const strengthLevels = strengthLevelsArray.map((val, index) => (
    <BotStrengthOption
      strengthLevel={val}
      key={index}
      handleChooseStrengthLevel={() => 1}
    />
  ));
  return <View style={styles.container}>{strengthLevels}</View>;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    gap: 8,
  },
});
