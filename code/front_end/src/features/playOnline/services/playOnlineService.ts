import {
  searchNewGameLink,
  submitMoveLink,
  cancelSearchLink,
  listenForFirstMoveLink,
  getGameByUsernameLink,
  listenForMoveLink,
  getBoardbyGameIdLink,
} from "../../../utils/ApiEndpoints";
import { getValueFor } from "../../../utils/AsyncStoreFunctions";
import {
  PendingChessGameRequest,
  SubmitMoveRequest,
  ListenForFirstMoveRequest,
  ChessGameResponse,
  ListenForMoveRequest,
} from "../../../utils/ServicesTypes";
import { searchRatingRange } from "../../../utils/Constants";
import { GameType } from "../../../chess-logic/board";
import { handlePost } from "../../../lib/fetch";

export const listenForMove = async (request: ListenForMoveRequest) => {
  return handlePost(listenForMoveLink, JSON.stringify(request)).catch((error) => {
    throw new Error(error);
  })
};

export const getGameByUsername = async (username: string) => {
  return handlePost(`${getGameByUsernameLink}${username}`).catch((error) => {
    throw new Error(error);
  });
};

export const listenForFirstMove = async (
  request: ListenForFirstMoveRequest
) => {
  return  handlePost(`${listenForFirstMoveLink}${request.gameId}`).catch((error) => {
    throw new Error(error);
  });
};

export const cancelSearch = async () => {
  return handlePost(cancelSearchLink).catch((error) => {
    throw new Error(error);
  });
};

export const searchForGame = async (request: PendingChessGameRequest) => {
  return handlePost(searchNewGameLink, JSON.stringify(request)).catch((error) => {
    throw new Error(error);
  });
};

export const setPendingGameRequest = (
  timeControl: number,
  increment: number,
  userRating: number,
  nameInGame: string,
  gameType: GameType
): PendingChessGameRequest => {
  return {
    timeControl: timeControl,
    increment: increment,
    userRating: userRating,
    topRating: userRating + searchRatingRange,
    bottomRating: userRating - searchRatingRange,
    isRated: true,
    nameInGame,
    gameType,
  };
};

export const submitMove = async (request: SubmitMoveRequest) => {
  return handlePost(submitMoveLink, JSON.stringify(request)).catch((error) => {
    throw new Error(error);
  });
};

export const getBoardByGameId = async (gameId: number) => {
  return handlePost(`${getBoardbyGameIdLink}${gameId}`).catch((error) => {
    throw new Error(error);
  });
};
