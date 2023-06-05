import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";

type Props = {
  info: Date | undefined;
  gameStarted: boolean;
  gameFinished: boolean;
  isMyTurn: boolean;
  setTimer: (timer: Date) => void;
};

export default function Timer({
  info,
  gameFinished,
  gameStarted,
  isMyTurn,
  setTimer,
}: Props) {
  useEffect(() => {
    const interval = setInterval(() => {
      if (info && gameStarted && !gameFinished && isMyTurn) {
        setTimer(new Date(info.setSeconds(info.getSeconds() - 1) * 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [info]);

  return (
    <View style={styles.appContainer}>
      <Text style={styles.appText}>
        {info
          ? info.getMinutes().toString() +
            ":" +
            (info.getSeconds().toString().length === 1
              ? "0" + info.getSeconds().toString()
              : info.getSeconds().toString())
          : null}
      </Text>
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
