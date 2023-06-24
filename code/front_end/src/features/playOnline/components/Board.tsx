import { View, Dimensions, StyleSheet, Animated } from "react-native";
import { Board } from "../../../chess-logic/board";
import Piece from "./Piece";
import Background from "./Background";
import React, { useRef, useEffect, useState } from "react";
import {
  PlayOnlineAction,
  PlayOnlineState,
} from "../reducers/PlayOnlineReducer";

type Props = {
  state: PlayOnlineState;
  dispatch: React.Dispatch<PlayOnlineAction>;
};
const SIZE = Dimensions.get("window").width / 8;
export default function TestBoard({ state, dispatch }: Props) {
  const [active, setActive] = useState<null | number>(null);

  const activeValues = useRef<Animated.Value[]>([]);
  const possibleMoves = useRef<Animated.Value[]>([]);

  useEffect(() => {
    console.log("length: ", activeValues.current.length);
    for (let i = 0; i < 64; i++) {
      activeValues.current.push(new Animated.Value(0));
      possibleMoves.current.push(new Animated.Value(0));
    }
  }, []);

  return activeValues.current.length > 0 ? (
    <View style={styles.container}>
      <View style={{ width: SIZE * 8, height: SIZE * 8 }}>
        <Background />
        {state.board.visualBoard.map((piece, i) => {
          return (
            <Piece
              key={Math.random()}
              id={piece}
              position={{ x: SIZE * (i % 8), y: SIZE * Math.floor(i / 8) }}
              state={state}
              dispatch={dispatch}
              activeValues={activeValues}
              possibleMoves={possibleMoves}
              positionNumber={i}
            />
          );
        })}
      </View>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
