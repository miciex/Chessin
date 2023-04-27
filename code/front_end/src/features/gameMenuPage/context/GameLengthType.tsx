import { createContext } from "react";

export type LengthType = {
  increment: number;
  totalTime: number;
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
});
