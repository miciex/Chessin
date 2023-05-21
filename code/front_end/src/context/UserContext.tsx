import { createContext } from "react";

export type User = {
  name: String;
  email: String;
  ranking: number;
  country: string;
};

export const UserContext = createContext<User>({
  name: "Wojtek",
  email: "Burek@gmail.com",
  ranking: 3600,
  country: "pl",
});
