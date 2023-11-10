export const ColorsPallet = {
  lighter: "#ece0d1",
  light: "#dbc1ac",
  baseColor: "#967259",
  dark: "#634832",
  darker: "#38220f",
  gray: "#bbbbbb",
  green: "#00ff00",
  red: "#ff0000",
  yellow: "#f4f72d"
};

export type StackParamList =
  | "AnalyzeGame"
  | "FreeBoard"
  | "GameMenu"
  | "Home"
  | "LastGame"
  | "Login"
  | "PlayBot"
  | "Friends"
  | "PlayOnline"
  | "PlayWithFriendsMenu"
  | "ProfilePage"
  | "Register"
  | "Socials"
  | "Notification"
  | "ResetPassword"
  |"RemindPassword"
  |"UserNotAuthenticated";

export const emailRegex: RegExp = new RegExp(
  /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/
);
export const nameRegex: RegExp = new RegExp(
  /^([ \u00c0-\u01ffa-zA-Z'\-]){3,20}$/
);
export const passwordRegex: RegExp = new RegExp(
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])[A-Za-z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{12,}$/
);
export const containsNumbersRegex: RegExp = new RegExp(/^.*[0-9].*/);
export const containsSpecialCharactersRegex: RegExp = new RegExp(/^.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~].*/);

export const notValidEmailMessage: string = "Email is not valid.";
export const letterPasswordCaseError: string =
  "Password must contain at least one uppercase letter and one lowercase letter.";
export const specialCharacterPasswordError: string = "password must contain a special character."
export const numberPasswordError: string = "password must contain a number";
export const toFewCharacterPasswordErrorMessage: string = "Password must contain at least 12 characters.";
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
export const getPasswordErrorMessage = (password: string) => {
  if (password.length < 12) {
    return toFewCharacterPasswordErrorMessage;
  } else if (!containsSpecialCharactersRegex.test(password)) {
    return specialCharacterPasswordError;
  }else if(!containsNumbersRegex.test(password)){
    return numberPasswordError;
  }else{
    return letterPasswordCaseError;
  }
}