import { Move } from "../features/playOnline";
import { HashMap } from "./Types";

export type ChessPiecesLetterType = "K" | "Q" | "R" | "B" | "N" | "";

export const baseBoard: Array<number> = [
  3, 5, 4, 2, 1, 4, 5, 3, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 14, 14,
  14, 14, 14, 14, 14, 11, 13, 14, 10, 9, 12, 13, 11,
];

export class Pieces {
  public static readonly KING = 1;
  public static readonly PAWN = 2;
  public static readonly ROOK = 3;
  public static readonly KNIGHT = 4;
  public static readonly BISHOP = 5;
  public static readonly QUEEN = 6;

  public static readonly WHITE = 8;
  public static readonly BLACK = 16;

  public static readonly PiecesArray: Array<number> = [
    this.KING,
    this.PAWN,
    this.ROOK,
    this.KNIGHT,
    this.BISHOP,
    this.QUEEN,
  ];
}

const QUEEN = 3;
export const Directions: { [key: number]: Array<number> } = {
  1: [1, -1, 8, -8, 7, -7, 9, -9],
  2: [8, 16, 7, 9],
  3: [1, -1, 8, -8],
  4: [6, 10, 15, 17, -6, -10, -15, -17],
  5: [7, 9, -7, -9],
  6: [8, -8, 1, -1, 9, -9, 7, -7],
};

export const piecesNumbers = [1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14];

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

//Convert sample moves array from  string array to a Move aray
export const sampleGame: Move[] = [
  { from: 12, to: 28, piece: 6, captured: 0, promotion: "" },
  { from: 56, to: 48, piece: 14 },
];
