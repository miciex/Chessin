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
  analyzeGame?: boolean
};
export default function GameRecord({
  moves,
  setCurrentPosition,
  positions,
  currentPosition,
  analyzeGame
}: Props) {

  const movesCut = analyzeGame&& moves.length >0 ? moves.slice(0) : moves;
  const getPos = (index:number) => {
    if(!analyzeGame) return index;
    return index + 1;
  }

  const movesContent = movesCut.map((move, index) => {
    return (
      <GameRecordMove
        move={moveToChessNotation(positions[index], move)}
        key={index}
        handlePress={() => {
          setCurrentPosition(getPos(index));
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


