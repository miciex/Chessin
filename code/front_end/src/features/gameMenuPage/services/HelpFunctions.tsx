import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LengthType } from "../context/GameLengthContext";
import { GameType } from "../../../chess-logic/board";

export const gameLengthTypeContextTypeToIconName = (tempo: LengthType) => {
  switch (tempo.gameType) {
    case GameType.BULLET:
      return <MaterialCommunityIcons name="bullet" size={24} color="black" />;
    case GameType.BLITZ:
      return (
        <MaterialCommunityIcons
          name="lightning-bolt"
          size={24}
          color="rgb(235, 203, 47)"
        />
      );
    case GameType.RAPID:
      return (
        <MaterialCommunityIcons
          name="clock-time-eight"
          size={24}
          color="green"
        />
      );
    default:
      return (
        <MaterialCommunityIcons name="clock-edit" size={24} color="black" />
      );
  }
};

export const lengthTypeToText: (tempo: LengthType) => string = (
  tempo: LengthType
) => {
  const secondsTime = tempo.totalTime / 1000;
  const secondsIncrement = tempo.increment / 1000;

  return (
    (secondsTime < 60 ? secondsTime : secondsTime / 60).toString() +
    (secondsIncrement > 0 ? "|" + secondsIncrement.toString() : "")
  );
};
