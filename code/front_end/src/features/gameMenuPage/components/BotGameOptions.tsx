import { View, Text, StyleSheet } from "react-native";
import React, { useState, useContext } from "react";
import BotOption from "./BotOption";
import BotStrengthOptionsBar from "./BotStrengthOptionsBar";
import { botType, BotTypeContext } from "../context/BotTypeContext";
import { strengthLevelType } from "../context/BotStrengthContext";
import StartGameButton from "../../../components/StartGameButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../Routing";

const stockFishLevelsArray = new Array<strengthLevelType>(
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8
);
const chessinBotLevelsArray = new Array<strengthLevelType>(1, 2, 3, 4);

type Props = {
  setBotType: (botType: botType) => void;
  setGameBotStrength: (botStrength: strengthLevelType) => void;
  handleChooseBotType: (botStrength: botType) => void;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "GameMenu",
    undefined
  >;
};

export default function BotGameOptions({
  setBotType,
  setGameBotStrength,
  handleChooseBotType,
  navigation,
}: Props) {
  const currentBotType = useContext(BotTypeContext);

  const strengthLevels = (
    level: Array<strengthLevelType>,
    botGameType: botType
  ) => {
    let currArray = new Array<strengthLevelType>();
    const contentArray = new Array();
    level.forEach((element, index) => {
      currArray.push(element);
      if (index > 0 && index % 4 === 3) {
        contentArray.push(
          <View style={styles.botStrengthOptionsBarContainer}>
            <BotStrengthOptionsBar
              strengthLevelsArray={[...currArray]}
              key={index}
              setGameBotStrength={setGameBotStrength}
              botGameType={botGameType}
              handleChooseBotType={handleChooseBotType}
            />
          </View>
        );
        currArray = [];
      }
    });
    return contentArray;
  };

  const stockFishBotContent = strengthLevels(stockFishLevelsArray, "Stockfish");
  const chessinBotContent = strengthLevels(chessinBotLevelsArray, "ChessinBot");
  //Todo: work on a styling of this page
  return (
    <View style={styles.container}>
      <View style={{ ...styles.optionsContainer, flex: 5 }}>
        <View style={styles.botOptionsContainer}>
          <View style={{ ...styles.botOptionsInnerContainer, marginTop: 4 }}>
            <BotOption setBotType={setBotType} name="fish" />
          </View>
        </View>
        <View style={{ ...styles.strengthLevelsContainer }}>
          {stockFishBotContent}
        </View>
      </View>

      <View style={{ ...styles.optionsContainer, flex: 3 }}>
        <View style={styles.botOptionsInnerContainer}>
          <BotOption setBotType={setBotType} name="robot" />
        </View>
        <View style={styles.strengthLevelsContainer}>{chessinBotContent}</View>
      </View>
      <View style={styles.startGameButtonOuterContainer}>
        <View style={styles.startGameButtonInnerContainer}>
          <StartGameButton navigation={navigation} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: 16,
  },
  botStrengthOptionsBarContainer: {
    width: "100%",
    flex: 1,
  },
  strengthLevelsContainer: {
    width: "80%",
    flex: 4,
  },
  botOptionsContainer: {
    flex: 1,
  },
  botOptionsInnerContainer: {},
  optionsContainer: {
    justifyContent: "space-evenly",
    alignItems: "center",
    rowGap: 20,
  },
  startGameButtonInnerContainer: {
    width: "80%",
    height: 32,
  },
  startGameButtonOuterContainer: {
    flex: 1,
    paddingTop: 8,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
