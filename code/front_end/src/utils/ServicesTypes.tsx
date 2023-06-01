import { responseUser } from "./PlayerUtilities";
import { MoveResponse } from "../chess-logic/move";

export type registerRequestType = {
  firstName: string;
  lastName: string;
  nick: string;
  email: string;
  password: string;
};

export type authenticationRequestType = {
  email: string;
  password: string;
  verificationType: VerificationType;
};

export type AuthenticationResponse = {
  refreshToken: string;
  accessToken: string;
};

export enum VerificationType {
  REGISTER,
  AUTHENTICATE,
  CHANGE_PASSWORD,
  REMIND_PASSWORD,
  CHANGE_EMAIL,
}

//timeControl in seconds
export type PendingChessGameRequest = {
  email: string;
  timeControl: number;
  increment: number;
  bottomRating: number;
  topRating: number;
  userRating: number;
};

export type ChessGameResponse = {
  id: number;
  whiteUser: responseUser;
  blackUser: responseUser;
  moves: Array<MoveResponse>;
  availableCastles: Array<number>;
  timeControl: number;
  increment: number;
  startBoard: string;
  whiteStarts: boolean;
};

export type SubmitMoveRequest = {
  gameId: number;
  email: string;
  movedPiece: number;
  startField: number;
  endField: number;
  promotePiece: number;
  isDrawOffered: boolean;
};
