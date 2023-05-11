import { View, StyleSheet } from "react-native";
import React from "react";
import { FieldInfo } from "../features/playOnline";
import ChessBoardField from "./ChessBoardField";

type Props = {
  board: Array<FieldInfo>;
};

export default function ChessBoard({ board }: Props) {
  const renderBoard = () => {
    const renderedBoard = [];
    for (let i = 0; i < 64; i++) {
      renderedBoard.push(<ChessBoardField key={i} info={board[i]} />);
    }
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
