import { View, StyleSheet } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import BaseCustomContentButton from "../../../components/BaseCustomContentButton";
import { ColorsPallet } from "../../../utils/Constants";
import { BotTypeContext, botType } from "../context/BotTypeContext";

type Props = {
  setBotType: (botType: botType) => void;
  name: "fish" | "robot";
};

export default function BotOption({ setBotType, name }: Props) {
  const botTypeContext = React.useContext(BotTypeContext);

  const handeSetChessinBot = () => {
    setBotType("ChessinBot");
  };

  const handeSetStockFish = () => {
    setBotType("Stockfish");
  };

  return (
    <View style={styles.buttonContainer}>
      <View
        style={
          (botTypeContext === "ChessinBot" && name === "robot") ||
          (botTypeContext === "Stockfish" && name === "fish")
            ? styles.buttonInnerContainerActive
            : styles.buttonInnerContainerUnactive
        }
      >
        <BaseCustomContentButton
          handlePress={handeSetStockFish}
          content={<FontAwesome5 name={name} size={24} color="black" />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 32,
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
  },
  buttonContainer: {
    width: 48,
    height: 48,
  },
  buttonInnerContainerActive: {
    width: "100%",
    height: "100%",
    backgroundColor: ColorsPallet.dark,
    borderRadius: 8,
    borderColor: ColorsPallet.darker,
    borderWidth: 4,
  },
  buttonInnerContainerUnactive: {
    width: "100%",
    height: "100%",
    backgroundColor: ColorsPallet.dark,
    borderRadius: 8,
  },
});
