import { useContext, createContext } from "react";

export type playType = "Play Online" | "Play With Bot";

export const TypeContext = createContext<playType>("Play Online");
