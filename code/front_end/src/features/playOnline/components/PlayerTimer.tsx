import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { GameResults } from "../../../chess-logic/board";
import {
  PlayOnlineState,
  PlayOnlineAction,
} from "../reducers/PlayOnlineReducer";

type Props = {
  state: PlayOnlineState;
  isMyPlayer: boolean;
  dispatch: React.Dispatch<PlayOnlineAction>;
};

const timeEndDate = new Date(0);

export default function PlayerTimer({ state, isMyPlayer, dispatch }: Props) {
  useEffect(() => {
    setTimer();
    return () => clearTimeout(timeout);
  }, [state.board.moves.length, state.board.result, state.board.whiteToMove]);

  useEffect(() => {
    setDisconnectionTimer();
    return () => clearTimeout(timeout);
  },[state.opponentDisconnected, state.board.result, state.board.whiteToMove]);


  const player = isMyPlayer ? state.myPlayer : state.opponent;
  let timeout: number;

  const setTimer = () => {
    if (
      state.board.whiteToMove === (player?.color === "white") &&
      state.board.moves.length>0 &&
      state.board.result === GameResults.NONE
    ) {
      timeout = setTimeout(setTimer, 1000);

      dispatch({
        type: isMyPlayer
          ? "updateMyClockByMilliseconds"
          : "updateOpponentClockByMilliseconds",
        payload: -1000,
      });
    }
  };

  const setDisconnectionTimer = () => {
    if (
      !isMyPlayer &&
      state.board.result === GameResults.NONE
      &&state.disconnectionTimer >= timeEndDate
    ) {
      timeout = setTimeout(setTimer, 1000);

      dispatch({
        type: "updateDisconnectionTimerByMillis",
        payload: -1000,
      });
    }
  }

  const getTimeToString = (time:Date | null) =>{
    if(!time) return "0:00";
  return time >= timeEndDate
      ? time.getMinutes().toString() +
        ":" +
        (time.getSeconds().toString().length === 1
          ? "0" + time.getSeconds().toString()
          : time.getSeconds().toString())
      : "0:00";
}

  const time = getTimeToString(state.opponentDisconnected && state.board.result === GameResults.NONE ? state.disconnectionTimer :player?.timeLeft);
    player?.timeLeft && player.timeLeft >= timeEndDate
      ? player.timeLeft.getMinutes().toString() +
        ":" +
        (player.timeLeft.getSeconds().toString().length === 1
          ? "0" + player.timeLeft.getSeconds().toString()
          : player.timeLeft.getSeconds().toString())
      : "0:00";

  return (
    <View style={styles.appContainer}>
      <Text style={styles.appText}>{time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  appText: {
    fontSize: 20,
  },
});
