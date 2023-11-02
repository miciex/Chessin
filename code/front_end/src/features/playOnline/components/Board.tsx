import { View, Dimensions, StyleSheet, Animated } from "react-native";
import Piece from "./Piece";
import Background from "../../../components/Background";
import React, { useRef, useEffect, useMemo } from "react";
import {
  PlayOnlineAction,
  PlayOnlineState,
} from "../reducers/PlayOnlineReducer";
import { mapToBoard } from "../../../chess-logic/helpMethods";

type Props = {
  state: PlayOnlineState;
  dispatch: React.Dispatch<PlayOnlineAction>;
  rotateBoard: boolean;
  ableToMove: boolean;
};

const SIZE = Dimensions.get("window").width / 8;

export default function Board({
  state,
  dispatch,
  rotateBoard,
  ableToMove,
}: Props) {
  const activeValues = useRef<Animated.Value[]>([]);
  const possibleMoves = useRef<Animated.Value[]>([]);

  useEffect(() => {
    for (let i = 0; i < 64; i++) {
      activeValues.current.push(new Animated.Value(0));
      possibleMoves.current.push(new Animated.Value(0));
    }
  }, []);

  const resetActiveValues = () => {
    if (activeValues.current.length === 0) return;
    for (let i = 0; i < 64; i++) {
      activeValues.current[i].setValue(0);
    }
  };

  const resetPossibleMoves = () => {
    if (possibleMoves.current.length === 0) return;
    for (let i = 0; i < 64; i++) {
      possibleMoves.current[i].setValue(0);
    }
  };

  const pieces = useMemo<JSX.Element[]>(() => {
    resetActiveValues();
    resetPossibleMoves();
    let position =
      (state.board.positions.length === 0 ||
      state.currentPosition >= state.board.positions.length ||
      state.currentPosition < 0)
        ? state.board.visualBoard
        : mapToBoard(state.board.positions[state.currentPosition]);
    let brd = position.map((piece, i) => {
      const y = rotateBoard ? 7 - Math.floor(i / 8) : Math.floor(i / 8);
      const x = rotateBoard ? 7 - (i % 8) : i % 8;
      const position = rotateBoard ? 63 - i : i;
      return (
        <Piece
          key={Math.random()}
          id={piece}
          position={{ x: SIZE * x, y: SIZE * y }}
          state={state}
          dispatch={dispatch}
          activeValues={activeValues}
          possibleMoves={possibleMoves}
          positionNumber={position}
          resetActiveValues={resetActiveValues}
          resetPossibleMoves={resetPossibleMoves}
          ableToMove={ableToMove}
          rotateBoard={rotateBoard}
        />
      );
    });
    return brd;
  }, [
    state.board,
    state.currentPosition,
    state.searchingGame,
    state.board.visualBoard,
    rotateBoard,
  ]);

  return activeValues.current.length > 0 ? (
    <View style={styles.container}>
      <View style={{ width: SIZE * 8, height: SIZE * 8 }}>
        <Background rotateBoard={rotateBoard} />
        {pieces}
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
