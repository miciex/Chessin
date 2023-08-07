import { GameType } from "../chess-logic/board";
import { GameLengthTypeContextType } from "../features/gameMenuPage/context/GameLengthContext";
import { loggedUserResponse } from "./ServicesTypes";

export type User = {
  firstname: string;
  lastname: string;
  email: string;
  nameInGame: string;
  country: string;
  ranking: Rankings;
  highestRanking: number;
  online?: boolean;
};

export type responseUser = {
  id: number;
  firstname: string;
  lastname: string;
  nameInGame: string;
  password: string;
  role: string;
  ratingBlitz: number;
  ratingBullet: number;
  ratingRapid: number;
  ratingClassical: number;
  country: string;
};

export type Player = {
  firstname: string;
  lastname: string;
  email: string;
  nameInGame: string;
  country: string;
  ranking: Rankings;
  highestRanking: number;
  online?: boolean;
  color: playColor;
  timeLeft: Date | null;
};

export type playColor = "white" | "black" | "spectator" | null;

export type Rankings = { [k in GameType]: number };

export const getBasePlayer = (): Player => {
  return {
    firstname: "",
    lastname: "",
    email: "",
    nameInGame: "",
    country: "",
    ranking: {
      BULLET: 0,
      BLITZ: 0,
      RAPID: 0,
      CLASSICAL: 0,
    },
    highestRanking: 0,
    color: null,
    timeLeft: null,
  };
};

export const responseUserToUser = (
  responseUser: responseUser,
  email: string
): User => {
  const rankings: Rankings = {
    BULLET: responseUser.ratingBullet,
    BLITZ: responseUser.ratingBlitz,
    RAPID: responseUser.ratingRapid,
    CLASSICAL: responseUser.ratingClassical,
  };

  return {
    firstname: responseUser.firstname,
    lastname: responseUser.lastname,
    email: email,
    nameInGame: responseUser.nameInGame,
    country: responseUser.country,
    ranking: rankings,
    highestRanking: getHighestRanking(rankings),
  };
};

export const loggedUserToUser = (loggedUser: loggedUserResponse): User => {
  const rankings: Rankings = {
    BULLET: loggedUser.ratingBullet,
    BLITZ: loggedUser.ratingBlitz,
    RAPID: loggedUser.ratingRapid,
    CLASSICAL: loggedUser.ratingClassical,
  };

  return {
    firstname: loggedUser.firstname,
    lastname: loggedUser.lastname,
    email: loggedUser.email,
    nameInGame: loggedUser.nameInGame,
    country: loggedUser.country,
    ranking: rankings,
    highestRanking: getHighestRanking(rankings),
  };
};

export const responseUserToPlayer = (
  responseUser: responseUser,
  color: playColor,
  email?: string
): Player => {
  const rankings: Rankings = {
    BULLET: responseUser.ratingBullet,
    BLITZ: responseUser.ratingBlitz,
    RAPID: responseUser.ratingRapid,
    CLASSICAL: responseUser.ratingClassical,
  };
  return {
    firstname: responseUser.firstname,
    lastname: responseUser.lastname,
    email: email ? email : "",
    nameInGame: responseUser.nameInGame,
    country: responseUser.country,
    ranking: rankings,
    highestRanking: getHighestRanking(rankings),
    color: color,
    timeLeft: null,
  };
};

export const userToPlayer = (user: User, color: playColor): Player => {
  return {
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    nameInGame: user.nameInGame,
    country: user.country,
    ranking: user.ranking,
    highestRanking: user.highestRanking,
    online: user.online,
    color: color,
    timeLeft: null,
  };
};

export const getHighestRanking = (rankings: Rankings) => {
  const rankingValues = Object.values(rankings);
  const highestRanking = Math.max(...rankingValues);
  return highestRanking;
};

export const getRanking = (
  gameLength: GameLengthTypeContextType,
  user: User
) => {
  switch (gameLength) {
    case "bullet":
      return user.ranking.BULLET;
    case "blitz":
      return user.ranking.BLITZ;
    case "rapid":
      return user.ranking.RAPID;
    case "classical":
      return user.ranking.CLASSICAL;
    default:
      return user.highestRanking;
  }
};
