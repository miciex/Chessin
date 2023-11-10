import { View, Text } from "react-native";
import React from "react";
import { Dimensions } from "react-native";
import { Move } from "../chess-logic/move";
import { ColorsPallet } from "../utils/Constants";

const WHITE = "#E2E2E2";
const BLACK = "#444444";

interface RowProps {
  row: number;
  rotateBoard: boolean;
  move?: Move;
}

interface SquareProps {
  row: number;
  col: number;
  rotateBoard: boolean;
  active: boolean;
}

const Square = ({ row, col, rotateBoard, active }: SquareProps) => {
  const SIZE = Dimensions.get("window").width / 8;
  const backgroundColor = (row + col) % 2 === 0 ? WHITE : BLACK;
  const color = (row + col) % 2 === 0 ? BLACK : WHITE;
  const colText = rotateBoard ? 7 - col : col;
  const rowText = !rotateBoard ? 8 - row : row + 1;
  return (
    <View
      style={{
        backgroundColor: backgroundColor,
        width: SIZE,
        height: SIZE,
        padding: 5,
        justifyContent: "space-between",
        opacity: 1,
      }}
    >
      {active ? <View
      style={{
        backgroundColor: ColorsPallet.yellow,
        width: SIZE,
        height: SIZE,
        padding: 5,
        opacity: 0.5,
        position: "absolute",
      }}
    /> : null}
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

const Row = ({ row, rotateBoard, move }: RowProps) => {
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      {new Array(8).fill(0).map((_, i) => (
      <Square key={i} row={row} col={i} rotateBoard={rotateBoard} active={getActive(row, i, rotateBoard,move)}/>
))}
    </View>
  );
};

type Props = {
  rotateBoard: boolean;
  move?:Move;
};

export default function Background({ rotateBoard, move }: Props) {
  return (
    <View style={{ flex: 1, position: "absolute" }}>
      {new Array(8).fill(0).map((_, i) => (
        <Row key={i} row={i} rotateBoard={rotateBoard} move={move}/>
      ))}
    </View>
  );
}

const getActive = (row:number, col:number,rotateBoard:boolean, move?:Move ) => {
  const active = move ? row * 8 + col === (rotateBoard ?63- move.endField : move.endField) || row * 8 + col === (rotateBoard ? 63- move.startField : move.startField) : false;
  return active;
}