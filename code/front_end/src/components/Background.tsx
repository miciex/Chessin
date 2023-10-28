import { View, Text } from "react-native";
import React from "react";
import { Dimensions } from "react-native";

const WHITE = "#E2E2E2";
const BLACK = "#222222";

interface RowProps {
  row: number;
  rotateBoard: boolean;
}

interface SquareProps {
  row: number;
  col: number;
  rotateBoard: boolean;
}

const Square = ({ row, col, rotateBoard }: SquareProps) => {
  const SIZE = Dimensions.get("window").width / 8;
  const backgroundColor = (row + col) % 2 === 0 ? WHITE : BLACK;
  const color = (row + col) % 2 === 0 ? BLACK : WHITE;
  const colText = rotateBoard ? 7 - col : col;
  const rowText = !rotateBoard ? 8 - row : row + 1;
  return (
    <View
      style={{
        backgroundColor,
        width: SIZE,
        height: SIZE,
        padding: 5,
        justifyContent: "space-between",
      }}
    >
      <Text style={{ color, fontWeight: "500", opacity: col === 0 ? 1 : 0 }}>
        {rowText}
      </Text>
      <Text
        style={{
          color,
          fontWeight: "500",
          alignSelf: "flex-end",
          opacity: row === 7 ? 1 : 0,
        }}
      >
        {String.fromCharCode("a".charCodeAt(0) + colText)}
      </Text>
    </View>
  );
};

const Row = ({ row, rotateBoard }: RowProps) => {
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      {new Array(8).fill(0).map((_, i) => (
        <Square key={i} row={row} col={i} rotateBoard={rotateBoard} />
      ))}
    </View>
  );
};

type Props = {
  rotateBoard: boolean;
};

export default function Background({ rotateBoard }: Props) {
  return (
    <View style={{ flex: 1, position: "absolute" }}>
      {new Array(8).fill(0).map((_, i) => (
        <Row key={i} row={i} rotateBoard={rotateBoard} />
      ))}
    </View>
  );
}
