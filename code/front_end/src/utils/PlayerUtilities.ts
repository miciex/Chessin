import { GameType } from "../chess-logic/board";
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
    playing?:boolean;
};

export type ResponseUser = {
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
  color: PlayColor;
  timeLeft: Date | null;
};

export type PlayColor = "white" | "black" | "spectator" | null;

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
  responseUser: ResponseUser,
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
  responseUser: ResponseUser,
  color: PlayColor,
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

export const userToPlayer = (user: User, color: PlayColor): Player => {
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
  gameLength: GameType,
  user: User
) => {
  switch (gameLength) {
    case "BULLET":
      return user.ranking.BULLET;
    case "BLITZ":
      return user.ranking.BLITZ;
    case "RAPID":
      return user.ranking.RAPID;
    case "CLASSICAL":
      return user.ranking.CLASSICAL;
    default:
      return user.highestRanking;
  }
};
