import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import { ColorsPallet } from "../../../utils/Constants";
import GameRecordMove from "./GameRecordMove";
import { Move } from "../../../chess-logic/move";
import { moveToChessNotation } from "../../../chess-logic/convertion";
import { Board } from "../../../chess-logic/board";

//TODO: change moves to array of Move type
type Props = {
  board: Board;
};
export default function GameRecord({ board }: Props) {
  //TODO: convert moves to string array
  const movesContent = board.moves.map((move, index) => {
    return (
      <GameRecordMove
        move={moveToChessNotation(board, move)}
        key={index}
        handlePress={() => {}}
      />
    );
  });

  return (
    <View style={styles.appContainer}>
      <ScrollView horizontal={true}>{movesContent}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: ColorsPallet.dark,
    justifyContent: "center",
  },
});
