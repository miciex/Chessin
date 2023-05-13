import { View, StyleSheet } from "react-native";
import React from "react";
import { PiecesNumberToIcon } from "../../../utils/ChessConvertionFunctions";
import { piecesNumbers } from "../../../utils/ChessConstants";
import { FontAwesome5 } from "@expo/vector-icons";

type Props = {
  barColor: "white" | "black";
};

export default function PiecesBar({ barColor }: Props) {
  const startIndex = barColor !== "white" ? 0 : 6;
  const piecesBar = piecesNumbers
    .slice(startIndex, 6 + startIndex)
    .map((number, index) =>
      PiecesNumberToIcon({
        pieceType: number,
        color: number < 8 ? "black" : "white",
        size: 24,
        key: index,
      })
    );

  return (
    <View style={styles.piecesBarContainer}>
      {piecesBar}
      <FontAwesome5 name="trash-alt" size={24} color="black" />
      <FontAwesome5 name="hand-pointer" size={24} color="black" />
    </View>
  );
}

const styles = StyleSheet.create({
  piecesBarContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    height: 32,
    alignItems: "center",
  },
});
