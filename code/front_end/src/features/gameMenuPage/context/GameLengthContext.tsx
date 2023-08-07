import { createContext } from "react";
import { GameType } from "../../../chess-logic/board";

export type LengthType = {
  increment: number;
  totalTime: number;
  gameType: GameType;
};

export const GameLengthTypeContext = createContext<LengthType>({
  increment: 0,
  totalTime: 600,
  gameType: GameType.RAPID,
});
