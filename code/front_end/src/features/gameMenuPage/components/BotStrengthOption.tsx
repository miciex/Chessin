import { View, StyleSheet } from "react-native";
import React, { useContext } from "react";
import { ColorsPallet } from "../../../utils/Constants";
import BaseButton from "../../../components/BaseButton";
import {
  strengthLevelType,
  botStrengthLevelContextType,
} from "../context/BotStrengthContext";
import { BotTypeContext, botType } from "../context/BotTypeContext";

type Props = {
  strengthLevel: strengthLevelType;
  handleChooseStrengthLevel: (botStrength: strengthLevelType) => void;
  handleChooseBotType: (botStrength: botType) => void;
  botGameType: botType;
};

export default function BotStrengthOption({
  strengthLevel,
  handleChooseStrengthLevel,
  botGameType,
  handleChooseBotType,
}: Props) {
  const botStrengthLevel = useContext(botStrengthLevelContextType);
  const botTypeContext = useContext(BotTypeContext);

  const handleOnPress = () => {
    handleChooseStrengthLevel(strengthLevel);
    handleChooseBotType(botGameType);
  };

  const color =
    botStrengthLevel === strengthLevel && botGameType === botTypeContext
      ? ColorsPallet.lighter
      : ColorsPallet.baseColor;

  return (
    <View style={{ ...styles.container, backgroundColor: color }}>
      <BaseButton
        text={strengthLevel.toString()}
        handlePress={handleOnPress}
        color={color}
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
    borderColor: ColorsPallet.darker,
    borderWidth: 2,
    borderRadius: 8,
  },
  text: {
    color: ColorsPallet.darker,
    fontWeight: "700",
  },
});
