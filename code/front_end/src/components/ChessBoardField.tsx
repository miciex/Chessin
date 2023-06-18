import {
  View,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Animated,
} from "react-native";
import React, { useRef } from "react";
import { FieldInfo } from "../features/playOnline";
import { FontAwesome5 } from "@expo/vector-icons";
import { ColorsPallet } from "../utils/Constants";

type Props = {
  info: FieldInfo;
  handleFieldPress: Function;
  backgroundColor: string;
  activeField: number;
  position: Animated.ValueXY;
};

export default function ChessBoardField({
  backgroundColor,
  info,
  handleFieldPress,
  position,
  activeField,
}: Props) {
  const dimensions = useWindowDimensions();

  const size = (dimensions.width * 0.9) / 8;

  const convertToIcon = (piece: Number) => {
    switch (piece) {
      case 17:
        return <FontAwesome5 name="chess-king" size={24} color="black" />;
      case 22:
        return <FontAwesome5 name="chess-queen" size={24} color="black" />;
      case 19:
        return <FontAwesome5 name="chess-rook" size={24} color="black" />;
      case 21:
        return <FontAwesome5 name="chess-bishop" size={24} color="black" />;
      case 20:
        return <FontAwesome5 name="chess-knight" size={24} color="black" />;
      case 18:
        return <FontAwesome5 name="chess-pawn" size={24} color="black" />;
      case 9:
        return <FontAwesome5 name="chess-king" size={24} color="white" />;
      case 14:
        return <FontAwesome5 name="chess-queen" size={24} color="white" />;
      case 11:
        return <FontAwesome5 name="chess-rook" size={24} color="white" />;
      case 13:
        return <FontAwesome5 name="chess-bishop" size={24} color="white" />;
      case 12:
        return <FontAwesome5 name="chess-knight" size={24} color="white" />;
      case 10:
        return <FontAwesome5 name="chess-pawn" size={24} color="white" />;
      default:
        return null;
    }
  };

  const piece = convertToIcon(info.piece);

  // console.log(position.x, position.y);

  return (
    <Pressable
      onPress={() => {
        handleFieldPress(info);
      }}
      style={[styles.container, { backgroundColor: backgroundColor }]} //info.fieldNumber === activeField ? { left:  calc(dimensions.width/2 - CURSOR_HALF_SIDE_SIZE), top: dimensions.height / 2 - C} : null ]}
      android_ripple={{
        color: "null",
        borderless: false,
      }}
    >
      <Animated.View
        style={[
          styles.innerContainer,
          // info.fieldNumber === activeField
          //   ? {
          //       left: Animated.subtract(position.x, size / 2),
          //       top: Animated.subtract(position.y, size / 2),
          //     }
          //   : null,
        ]}
      >
        {piece}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "12.5%",
    height: "12.5%",
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
