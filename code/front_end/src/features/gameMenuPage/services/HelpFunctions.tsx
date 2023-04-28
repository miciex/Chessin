import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  GameLengthTypeContextType,
  LengthType,
} from "../context/GameLengthContext";

export const gameLengthTypeContextTypeToIconName = (tempo: LengthType) => {
  switch (tempo.lengthType) {
    case GameLengthTypeContextType.BULLET:
      return <MaterialCommunityIcons name="bullet" size={24} color="black" />;
    case GameLengthTypeContextType.BLITZ:
      return (
        <MaterialCommunityIcons
          name="lightning-bolt"
          size={24}
          color="rgb(235, 203, 47)"
        />
      );
    case GameLengthTypeContextType.RAPID:
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
  return (
    (tempo.totalTime < 60 ? tempo.totalTime : tempo.totalTime / 60).toString() +
    (tempo.increment > 0 ? "|" + tempo.increment.toString() : "")
  );
};
