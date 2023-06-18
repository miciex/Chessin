import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  PanResponder,
  Animated,
  Platform,
} from "react-native";
import { useState, useRef } from "react";

export default function App() {
  const [activeField, setActiveField] = useState<number>(0);

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null,
        { dx: pan.x, dy: pan.y },
      ] as any),
      onPanResponderRelease: () => {
        console.log("release");
        pan.extractOffset;
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const setBackGroundColor = (fieldNumber: number): string => {
    return fieldNumber % 2 === Math.floor(fieldNumber / 8) % 2
      ? "brown"
      : "white";
  };

  const renderBoard = () => {
    const board = [];
    for (let i = 0; i < 64; i++) {
      board.push(
        <View
          style={[
            styles.FieldConatainer,
            activeField === i ? { zIndex: 50 } : null,
          ]}
        >
          <Animated.View
            style={[
              styles.innerField,
              { backgroundColor: setBackGroundColor(i) },
              0 === i ? pan.getLayout() : null,
              // 0 === i
              //   ? {
              //       position: "relative",
              //       // zIndex: 100,
              //       backgroundColor: "blue",
              //     }
              //   : null,
            ]}
            key={Math.random()}
            {...panResponder.panHandlers}
          >
            <Text>{i}</Text>
          </Animated.View>
        </View>
      );
    }
    return board;
  };

  const brd = renderBoard();

  return (
    <View style={styles.container}>
      <View style={styles.boardContainer}>{brd}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  boardContainer: {
    width: "100%",
    aspectRatio: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    borderColor: "red",
    borderWidth: 1,
  },
  FieldConatainer: {
    width: "12.5%",
    height: "12.5%",
    alignItems: "center",
    justifyContent: "center",
  },
  innerField: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
