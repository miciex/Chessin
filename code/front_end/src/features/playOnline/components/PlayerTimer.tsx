import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { Player } from "../../../utils/PlayerUtilities";
import { Board, GameResults } from "../../../chess-logic/board";
import { PlayOnlineAction, PlayOnlineState } from "../../../pages/PlayOnline";

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
  }, [state.board.whiteToMove, state.gameStarted, state.board.result]);

  const player = isMyPlayer ? state.myPlayer : state.opponent;
  let timeout: number;

  const setTimer = () => {
    if (
      state.board.whiteToMove === (player?.color === "white") &&
      state.gameStarted &&
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

  // console.log(info?.getSeconds());

  const time =
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
