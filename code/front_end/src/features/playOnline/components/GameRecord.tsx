import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useMemo } from "react";
import { ColorsPallet } from "../../../utils/Constants";
import GameRecordMove from "./GameRecordMove";
import { Move } from "../../../chess-logic/move";
import { moveToChessNotation } from "../../../chess-logic/convertion";
import { Board } from "../../../chess-logic/board";

//TODO: change moves to array of Move type
type Props = {
  board: Board;
  currentPosition: number;
  setCurrentPosition: (position: number) => void;
};
export default function GameRecord({
  board,
  currentPosition,
  setCurrentPosition,
}: Props) {
  //TODO: convert moves to string array
  const movesContent = board.moves.map((move, index) => {
    return (
      <GameRecordMove
        move={moveToChessNotation(board, move)}
        key={index}
        handlePress={() => {
          setCurrentPosition(index);
        }}
        currentPosition={currentPosition}
        id={index}
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
