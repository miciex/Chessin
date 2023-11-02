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

export const listenForMove = async (request: ListenForMoveRequest) => {
  const accessToken = await getValueFor("accessToken");

  const response = await fetch(`${listenForMoveLink}`, {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 400) {
        response
          .text()
          .then((data) => {
            throw new Error(data);
          })
          .catch((error) => {
            throw new Error(error);
          });
      } else {
        throw new Error("Something went wrong in listen for move");
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
  return response;
};

export const getGameByUsername = async (username: string) => {
  const accessToken = await getValueFor("accessToken");
  const response = await fetch(`${getGameByUsernameLink}${username}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json() as Promise<ChessGameResponse>;
      } else if (response.status === 400) {
        response
          .text()
          .then((data) => {
            throw new Error(data);
          })
          .catch((error) => {
            throw new Error(error);
          });
      } else {
        console.error("don't know what happened");
        console.error(response);
        throw new Error("Something went wrong in get game by username");
      }
    })
    .catch((error) => {
      throw new Error(error);
    });

  return response;
};

export const listenForFirstMove = async (
  request: ListenForFirstMoveRequest
) => {
  const accessToken = await getValueFor("accessToken");

  const response = await fetch(`${listenForFirstMoveLink}${request.gameId}`, {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 400) {
        response
          .text()
          .then((data) => {
            throw new Error(data);
          })
          .catch((error) => {
            throw new Error(error);
          });
      } else {
        throw new Error("Something went wrong in listen for first move");
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
  return response;
};

export const cancelSearch = async () => {
  const accessToken = await getValueFor("accessToken");

  fetch(cancelSearchLink, {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 400) {
        response
          .text()
          .then((data) => {
            throw new Error(data);
          })
          .catch((error) => {
            throw new Error(error);
          });
      } else {
        throw new Error("Something went wrong in cancel search");
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export const searchForGame = async (request: PendingChessGameRequest) => {
  const accessToken = await getValueFor("accessToken");

  const response = await fetch(searchNewGameLink, {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request),
  }).catch((error) => {
    throw new Error(error);
  });
  return response;
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
  const accessToken = await getValueFor("accessToken");
  return await fetch(submitMoveLink, {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request),
  })
    .then((response) => {
      if(response.status===100){
        return null;
      }
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 400) {
        response
          .text()
          .then((data) => {
            throw new Error(`submit move error: ${data}`);
          })
          .catch((error) => {
            throw new Error(error);
          });
      } else {
        throw new Error("Something went wrong in submit move");
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export const getBoardByGameId = async (gameId: number) => {

  const accessToken = await getValueFor("accessToken");
  try {
    const response = await fetch(`${getBoardbyGameIdLink}${gameId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong in getting board by game id!");
  }
};
