import { View, Text, StyleSheet } from "react-native";
import React from "react";
import BotStrengthOption from "./BotStrengthOption";
import { strengthLevelType } from "../context/BotStrengthContext";
import { botType } from "../context/BotTypeContext";

type Props = {
  setGameBotStrength: (botStrength: strengthLevelType) => void;
  handleChooseBotType: (botStrength: botType) => void;
  strengthLevelsArray: Array<strengthLevelType>;
  botGameType: botType;
};

export default function BotStrengthOptionsBar({
  strengthLevelsArray,
  setGameBotStrength,
  botGameType,
  handleChooseBotType,
}: Props) {
  const strengthLevels = strengthLevelsArray.map((val, index) => (
    <BotStrengthOption
      strengthLevel={val}
      key={index}
      handleChooseStrengthLevel={setGameBotStrength}
      botGameType={botGameType}
      handleChooseBotType={handleChooseBotType}
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
