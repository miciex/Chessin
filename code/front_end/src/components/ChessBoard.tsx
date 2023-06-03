import { View, StyleSheet } from "react-native";
import React from "react";
import { FieldInfo } from "../features/playOnline";
import { ColorsPallet } from "../utils/Constants";
import { getInitialChessBoard } from "../features/playOnline";
import ChessBoardField from "./ChessBoardField";

const board = getInitialChessBoard();

export default function ChessBoard() {
  let copyPossibleMoves: Number[] = [0];

  const setBackgroundColor = (info: FieldInfo) => {
    //setting the background to white and black (normal chess board)
    return (info.fieldNumber % 2 === 0 &&
      Math.floor(info.fieldNumber / 8) % 2 === 0) ||
      (info.fieldNumber % 2 === 1 && Math.floor(info.fieldNumber / 8) % 2 === 1)
      ? ColorsPallet.light
      : ColorsPallet.dark;
  };

  const renderBoard = () => {
    const renderedBoard = [];

    for (let i = 0; i < 64; i++) {
      renderedBoard.push(
        <ChessBoardField
          key={i}
          info={{ piece: board.visualBoard[i], fieldNumber: i }}
          handleFieldPress={() => {}}
          backgroundColor={setBackgroundColor({
            piece: board.visualBoard[i],
            fieldNumber: i,
          })}
        />
      );
    }
    copyPossibleMoves = [];

    return renderedBoard;
  };

  const renderedBoard = renderBoard();

  return <View style={styles.container}>{renderedBoard}</View>;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flexWrap: "wrap",
    flexDirection: "row",
  },
});
