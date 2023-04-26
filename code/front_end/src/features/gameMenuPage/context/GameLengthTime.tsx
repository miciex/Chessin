import { createContext } from "react";

export type LengthType = {
  increment: Number;
  totalTime: Number;
};

export type GameLengthTypeContextType = "blitz" | "bullet" | "rapid" | "custom";

export const GameLengthTypeContext =
  createContext<GameLengthTypeContextType>("rapid");
