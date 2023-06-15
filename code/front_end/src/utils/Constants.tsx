import { PendingChessGameRequest } from "./ServicesTypes";

export const ColorsPallet = {
  lighter: "#ece0d1",
  light: "#dbc1ac",
  baseColor: "#967259",
  dark: "#634832",
  darker: "#38220f",
};

export type StackParamList =
  | "AnalyzeGame"
  | "FreeBoard"
  | "GameMenu"
  | "Home"
  | "LastGame"
  | "Login"
  | "PlayBot"
  | "PlayOnline"
  | "PlayWithFriendsMenu"
  | "ProfilePage"
  | "Register"
  | "Socials"
  | "Notification"
  | "ResetPassword";

export const emailRegex: RegExp = new RegExp(
  /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/
);
export const nameRegex: RegExp = new RegExp(
  /^([ \u00c0-\u01ffa-zA-Z'\-]){3,}$/
);
export const passwordRegex: RegExp = new RegExp(
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{12,}$/
);

export const notValidEmailMessage: string = "Email is not valid.";
export const notValidPasswordMessage: string =
  "Password must contain at least 10 characters, one letter uppercase letter, one lowercase letter, one number and one special character.";
export const notValidPasswordRepeatMessage: string =
  "Passwords are not the same.";
export const notValidNameMessage: string =
  "Name mustn`t contain numbers and must contain at least 3 characters.";
export const notValidSurnameMessage: string =
  "Surname mustn`t contain numbers and must contain at least 3 characters.";
export const notValidNickMessage: string =
  "Nick mustn`t contain numbers and must contain at least 3 characters.";

export const searchRatingRange: number = 200;

export const ALPHABET: string = "abcdefghijklmnopqrstuvwxyz";
