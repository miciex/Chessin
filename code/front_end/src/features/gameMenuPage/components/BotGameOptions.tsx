import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import BotOptions from "./BotOptions";
import BotStrengthOptionsBar from "./BotStrengthOptionsBar";

const stockFishLevelsArray = [1, 2, 3, 4, 5, 6, 7, 8];
const chessinBotLevelsArray = [1, 2, 3, 4];

export type botType = "Stockfish" | "ChessinBot";

export default function BotGameOptions() {
  const [currentBotType, setCurrentBotType] = useState<botType>("Stockfish");

  const strengthLevels = (level: Array<Number>) => {
    const currArray = new Array<Number>();
    const contentArray = new Array();
    level.forEach((element, index) => {
      currArray.push(element);
      if (index > 0 && index % 4 === 3) {
        contentArray.push(
          <View style={styles.botStrengthOptionsBarContainer}>
            <BotStrengthOptionsBar strengthLevelsArray={currArray} />
          </View>
        );
      }
    });
    return contentArray;
  };

  return (
    <View style={styles.container}>
      <BotOptions />
      <View style={styles.strengthLevelsContainer}>
        {strengthLevels(
          currentBotType === "ChessinBot"
            ? chessinBotLevelsArray
            : stockFishLevelsArray
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  botStrengthOptionsBarContainer: {
    width: "100%",
  },
  strengthLevelsContainer: {
    width: "80%",
  },
});
