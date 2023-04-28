import { createContext } from "react";
import { User } from "../../../context/UserContext";

export const chosenFriendContext = createContext<User | null>(null);
