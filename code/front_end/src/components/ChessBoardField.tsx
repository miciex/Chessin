import { View, StyleSheet } from "react-native";
import React from "react";
import { FieldInfo } from "../features/playOnline";
import { FontAwesome5 } from "@expo/vector-icons";
import { ColorsPallet } from "../utils/Constants";

type Props = {
  info: FieldInfo;
};

export default function ChessBoardField({ info }: Props) {
  const convertToIcon = (piece: Number) => {
    switch (piece) {
      case 1:
        return <FontAwesome5 name="chess-king" size={24} color="black" />;
      case 2:
        return <FontAwesome5 name="chess-queen" size={24} color="black" />;
      case 3:
        return <FontAwesome5 name="chess-rook" size={24} color="black" />;
      case 4:
        return <FontAwesome5 name="chess-bishop" size={24} color="black" />;
      case 5:
        return <FontAwesome5 name="chess-knight" size={24} color="black" />;
      case 6:
        return <FontAwesome5 name="chess-pawn" size={24} color="black" />;
      case 9:
        return <FontAwesome5 name="chess-king" size={24} color="white" />;
      case 10:
        return <FontAwesome5 name="chess-queen" size={24} color="white" />;
      case 11:
        return <FontAwesome5 name="chess-rook" size={24} color="white" />;
      case 12:
        return <FontAwesome5 name="chess-bishop" size={24} color="white" />;
      case 13:
        return <FontAwesome5 name="chess-knight" size={24} color="white" />;
      case 14:
        return <FontAwesome5 name="chess-pawn" size={24} color="white" />;
      default:
        return null;
    }
  };

  const piece = convertToIcon(info.piece);

  const backgroundColor =
    (info.fieldNumber % 2 === 0 &&
      Math.floor(info.fieldNumber / 8) % 2 === 0) ||
    (info.fieldNumber % 2 === 1 && Math.floor(info.fieldNumber / 8) % 2 === 1)
      ? ColorsPallet.light
      : ColorsPallet.dark;

  return (
    <View style={{ ...styles.container, backgroundColor: backgroundColor }}>
      {piece}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "12.5%",
    height: "12.5%",
    alignItems: "center",
    justifyContent: "center",
  },
});
