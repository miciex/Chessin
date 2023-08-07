import { createContext } from "react";
import { User } from "../../../utils/PlayerUtilities";

export const chosenFriendContext = createContext<User | null>(null);
