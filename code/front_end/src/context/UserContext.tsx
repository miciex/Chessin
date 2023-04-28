import { createContext } from "react";

export type User = {
  name: String;
  email: String;
};

export const UserContext = createContext<User>({
  name: "Wojtek",
  email: "Burek@gmail.com",
});
