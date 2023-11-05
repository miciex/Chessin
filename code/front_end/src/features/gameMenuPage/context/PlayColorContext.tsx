import { createContext } from "react";

export type PlayColorsContextType = "WHITE" | "BLACK" | "RANDOM";

export const PlayColorsContext = createContext<PlayColorsContextType>("RANDOM");
