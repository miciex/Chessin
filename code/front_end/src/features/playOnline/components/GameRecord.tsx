import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useMemo } from "react";
import { ColorsPallet } from "../../../utils/Constants";
import GameRecordMove from "./GameRecordMove";
import { Move } from "../../../chess-logic/move";
import { moveToChessNotation } from "../../../chess-logic/convertion";
import { Board } from "../../../chess-logic/board";
import {
  PlayOnlineAction,
  PlayOnlineState,
} from "../reducers/PlayOnlineReducer";

//TODO: change moves to array of Move type
type Props = {
  state: PlayOnlineState;
  dispatch: React.Dispatch<PlayOnlineAction>;
};
export default function GameRecord({
  state: { board, currentPosition },
  dispatch,
}: Props) {
  //TODO: convert moves to string array
  const movesContent = board.moves.map((move, index) => {
    return (
      <GameRecordMove
        move={moveToChessNotation(board, move)}
        key={index}
        handlePress={() => {
          dispatch({ type: "setCurrentPosition", payload: index });
        }}
        currentPosition={currentPosition}
        id={index}
      />
    );
  });

  return (
    <View style={styles.appContainer}>
      <ScrollView horizontal={true}>{movesContent}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: ColorsPallet.dark,
    justifyContent: "center",
  },
});
