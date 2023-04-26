import { createContext } from "react";

export type PlayColorsContextType = "white" | "black" | "random";

export const PlayColorsContext = createContext<PlayColorsContextType>("random");
