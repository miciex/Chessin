import { responseUser } from "./PlayerUtilities";
import { MoveResponse } from "../chess-logic/move";
import { GameResults } from "../chess-logic/board";

export type RegisterRequest = {
  firstname: string;
  lastname: string;
  nameInGame: string;
  email: string;
  password: string;
  country: string;
};

export type LoginRequest = {
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
  movedPiece: number;
  startField: number;
  endField: number;
  promotePiece: number;
  isDrawOffered: boolean;
};

export type BoardResponse = {
  moves: Array<MoveResponse>;
  whiteTurn: boolean;
  whiteEmail: string;
  blackEmail: string;
  position: { [key: number]: number };
  positions: Array<{ [key: number]: number }>;
  movesTo50MoveRule: number;
  movedPieces: Array<number>;
  availableCastles: Array<number>;
  gameResult: GameResults;
  visualBoard: Array<number>;
  startBoard: string;
  whiteTime: number;
  blackTime: number;
  lastMoveTime: number;
};

export type CodeVerificationRequest = {
  email: string;
  verificationCode: string;
  verificationType: VerificationType;
  newPassword?: string;
  password?: string;
  firstname?: string;
  lastname?: string;
  nameInGame?: string;
  country?: string;
};

export type ListenForFirstMoveRequest = {
  gameId: number;
};

export type FriendInvitationRequest = {
  friendNickname:string;
}
export type ListenForMoveRequest = {
  gameId: number;
  moves: Array<MoveResponse>;
};

export type HandleFriendInvitation = {
  friendEmail: string;
  responseType: FriendInvitationResponseType;

}

export type HandleSearchBarSocials = {
  searchNickname: string;
}

export enum FriendInvitationResponseType {
  ACCEPT="ACCEPT", DECLINE="DECLINE"
}
