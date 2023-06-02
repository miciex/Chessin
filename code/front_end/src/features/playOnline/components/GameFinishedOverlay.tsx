import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { ColorsPallet } from "../../../utils/Constants";
import BaseButton from "../../../components/BaseButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../Routing";
import { StackParamList } from "../../../utils/Constants";
import { GameResults } from "../../../chess-logic/board";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    StackParamList,
    undefined
  >;
  searchForGame: () => void;
  whoWon: GameResults;
  whitesTurn: boolean;
};
export default function GameFinishedOverlay({
  navigation,
  whoWon,
  searchForGame,
  whitesTurn,
}: Props) {
  const getText = (): string => {
    switch (whoWon) {
      case GameResults.DRAW_50_MOVE_RULE:
      case GameResults.INSUFFICIENT_MATERIAL:
      case GameResults.STALEMATE:
      case GameResults.THREE_FOLD:
        return "Draw";
      case GameResults.MATE:
        return whitesTurn ? "Black won" : "White won";
      default:
        return "";
    }
  };

  const winnerText = getText();

  return (
    <View style={styles.container}>
      <View>
        <Text>Game finished</Text>
        <Text>{winnerText}</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.buttonContainer}>
          <BaseButton text="Play again" handlePress={searchForGame} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    backgroundColor: ColorsPallet.light,
    opacity: 0.8,
  },
  textContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  buttonContainer: {
    width: "50%",
    height: 32,
  },
  contentContainer: {
    flex: 2,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
