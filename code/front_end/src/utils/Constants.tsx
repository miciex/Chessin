export const ColorsPallet = {
  lighter: "#ece0d1",
  light: "#dbc1ac",
  baseColor: "#967259",
  dark: "#634832",
  darker: "#38220f",
};

export type StackParamList =
  | "Analyze"
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
  | "Socials";

export const baseBoard: Array<number> = [
  3, 5, 4, 2, 1, 4, 5, 3, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 14, 14,
  14, 14, 14, 14, 14, 11, 13, 14, 10, 9, 12, 13, 11,
];

export const sampleMoves: Array<string> = [
  "e4",
  "e5",
  "Nf3",
  "Nc6",
  "Bb5",
  "a6",
  "Ba4",
  "Nf6",
  "O-O",
  "Be7",
  "Re1",
  "b5",
  "Bb3",
  "d6",
  "c3",
  "O-O",
  "h3",
  "Nb8",
  "d4",
  "Nbd7",
  "Nbd2",
  "Bb7",
  "Bc2",
  "Re8",
  "b3",
  "Bf8",
  "Bb2",
  "c6",
  "Nf1",
  "Qc7",
  "Ng3",
  "Rad8",
  "Qd2",
  "d5",
  "dxe5",
  "Nxe5",
  "Nxe5",
  "Rxe5",
  "c4",
  "c5",
  "Rad1",
  "d4",
  "exd4",
  "Rxd4",
  "Qxd4",
  "Bxd4",
  "Rxe8",
  "Rxe8",
  "Bxd4",
  "cxd4",
  "Nf5",
  "Re1+",
  "Kh2",
  "Rd8",
  "Ne7+",
  "Kh8",
  "Nxd5",
  "Rxd5",
  "Re8#",
  "Ng8",
  "Rxg8+",
];
