import { createContext } from "react";

export type strengthLevelType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const botStrengthLevelContextType = createContext<strengthLevelType>(1);
