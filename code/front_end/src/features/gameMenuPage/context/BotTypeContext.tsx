import { createContext } from "react";

export type botType = "Stockfish" | "ChessinBot";

export const BotTypeContext = createContext<botType>("ChessinBot");
