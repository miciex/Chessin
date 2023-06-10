import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { Player } from "../../../utils/PlayerUtilities";
import { Board, GameResults } from "../../../chess-logic/board";

type Props = {
  info: Date | undefined;
  gameStarted: boolean;
  gameFinished: boolean;
  changeTimerBySeconds: (seconds: number) => void;
  player: Player | null;
  board: Board;
};

const timeEndDate = new Date(0);

export default function Timer({
  info,
  gameFinished,
  gameStarted,
  board,
  player,
  changeTimerBySeconds,
}: Props) {
  useEffect(() => {
    setTimer();
    return () => clearTimeout(timeout);
  }, [board.whiteToMove, gameStarted, board.result]);

  let timeout: number;

  const setTimer = () => {
    if (
      board.whiteToMove === (player?.color === "white") &&
      gameStarted &&
      board.result === GameResults.NONE
    ) {
      timeout = setTimeout(setTimer, 1000);

      changeTimerBySeconds(-1000);
    }
  };

  // console.log(info?.getSeconds());

  const time =
    info && info >= timeEndDate
      ? info.getMinutes().toString() +
        ":" +
        (info.getSeconds().toString().length === 1
          ? "0" + info.getSeconds().toString()
          : info.getSeconds().toString())
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
