import { createContext } from "react";

export type LengthType = {
  increment: number;
  totalTime: number;
  lengthType: GameLengthTypeContextType;
};

export enum GameLengthTypeContextType {
  BULLET = "bullet",
  BLITZ = "blitz",
  RAPID = "rapid",
  CUSTOM = "custom",
}

export const GameLengthTypeContext = createContext<LengthType>({
  increment: 0,
  totalTime: 600,
  lengthType: GameLengthTypeContextType.RAPID,
});
