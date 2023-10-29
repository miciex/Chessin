import { View, StyleSheet, ScrollView } from "react-native";
import { ColorsPallet } from "../../../utils/Constants";
import GameRecordMove from "./GameRecordMove";
import { moveToChessNotation } from "../../../chess-logic/convertion";
import {
  PlayOnlineAction,
  PlayOnlineState,
} from "../reducers/PlayOnlineReducer";
import { Move } from "../../../chess-logic/move";

type Props = {
  moves: Move[];
  setCurrentPosition: (position: number) => void;
  positions: Array<{[key:number]:number}>;
  currentPosition: number;
};
export default function GameRecord({
  moves,
  setCurrentPosition,
  positions,
  currentPosition
}: Props) {
  const movesContent = moves.map((move, index) => {
    return (
      <GameRecordMove
        move={moveToChessNotation(positions[index], move)}
        key={index}
        handlePress={() => {
          setCurrentPosition(index);
        }}
        currentPosition={currentPosition}
        id={index}
      />
    );
  });

  return (
      <>{movesContent}</>
  );
}


