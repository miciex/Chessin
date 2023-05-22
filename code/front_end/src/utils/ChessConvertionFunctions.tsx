import React, { ReactElement } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { ColorsPallet } from "./Constants";
import { View, Text, StyleProp, ViewStyle, StyleSheet } from "react-native";
import { ChessPiecesLetterType } from "./chess-calculations/ChessConstants";

export type PiecesNumberToIconTypeProps = {
  pieceType: number | string;
  styles?: StyleProp<any>;
  size?: number;
  color?: string;
  key?: string | number;
};

export const PiecesNumberToIcon = ({
  pieceType,
  styles,
  size,
  color,
  key,
}: PiecesNumberToIconTypeProps) => {
  switch (typeof pieceType === "string" ? pieceType : pieceType % 8) {
    case 1:
    case "K":
      return (
        <FontAwesome5
          name="chess-king"
          size={size ? size : 24}
          color={color ? color : ColorsPallet.lighter}
          style={styles ? styles : null}
          key={key}
        />
      );
    case 2:
    case "Q":
      return (
        <FontAwesome5
          name="chess-queen"
          size={size ? size : 24}
          color={color ? color : ColorsPallet.lighter}
          style={styles ? styles : null}
          key={key}
        />
      );
    case 3:
    case "R":
      return (
        <FontAwesome5
          name="chess-rook"
          size={size ? size : 24}
          color={color ? color : ColorsPallet.lighter}
          style={styles ? styles : null}
          key={key}
        />
      );
    case 4:
    case "B":
      return (
        <FontAwesome5
          name="chess-bishop"
          size={size ? size : 24}
          color={color ? color : ColorsPallet.lighter}
          style={styles ? styles : null}
          key={key}
        />
      );
    case 5:
    case "N":
      return (
        <FontAwesome5
          name="chess-knight"
          size={size ? size : 24}
          color={color ? color : ColorsPallet.lighter}
          style={styles ? styles : null}
          key={key}
        />
      );
    case 6:
    case "":
      return (
        <FontAwesome5
          name="chess-pawn"
          size={size ? size : 24}
          color={color ? color : ColorsPallet.lighter}
          style={styles ? styles : null}
          key={key}
        />
      );
    default:
      return null;
  }
};

export type StringMoveToTextTypeProps<T> = {
  move: string;
  textStyles?: StyleProp<T>;
  containerStyles?: StyleProp<T>;
};

export const StringMoveToText = ({
  move,
  textStyles,
  containerStyles,
}: StringMoveToTextTypeProps<ViewStyle>) => {
  const pieceLetter =
    [...move][0] === [...move][0].toUpperCase() ? [...move][0] : "";

  const icon = PiecesNumberToIcon({
    pieceType: pieceLetter,
    size: 16,
  });

  return (
    <View style={containerStyles ? containerStyles : styles.moveContainer}>
      {icon}
      <Text style={textStyles ? textStyles : styles.text}>
        {icon && pieceLetter ? move.slice(1, move.length) : move}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  moveContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    flexBasis: "20%",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    color: "white",
  },
});
