import { View, Text } from "react-native";
import React from "react";
import { Dimensions } from "react-native";

const WHITE = "#F5F5F5";
const BLACK = "#222222";

interface RowProps {
  row: number;
}

interface SquareProps {
  row: number;
  col: number;
}

const Square = ({ row, col }: SquareProps) => {
  const SIZE = Dimensions.get("window").width / 8;
  const backgroundColor = (row + col) % 2 === 0 ? WHITE : BLACK;
  const color = (row + col) % 2 === 0 ? BLACK : WHITE;
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
        {8 - row}
      </Text>
      <Text
        style={{
          color,
          fontWeight: "500",
          alignSelf: "flex-end",
          opacity: row === 7 ? 1 : 0,
        }}
      >
        {String.fromCharCode("a".charCodeAt(0) + col)}
      </Text>
    </View>
  );
};

const Row = ({ row }: RowProps) => {
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      {new Array(8).fill(0).map((_, i) => (
        <Square key={i} row={row} col={i} />
      ))}
    </View>
  );
};

export default function Background() {
  return (
    <View style={{ flex: 1, position: "absolute" }}>
      {new Array(8).fill(0).map((_, i) => (
        <Row key={i} row={i} />
      ))}
    </View>
  );
}
