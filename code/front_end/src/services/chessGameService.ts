import { handlePost } from "../lib/fetch";
import {
  getGameByIdLink,
  getGameHistoryLink,
  isUserPlayingLink,
  isUserPlayingTimeControlLink,
  listenForDisconnectionLink,
  listenForDrawOfferLink,
  listenForResignationLink,
  offerDrawLink,
  pingLink,
  resignLink,
  respondToDrawOfferLink,
} from "../utils/ApiEndpoints";
import { RespondToDrawOfferRequest } from "../utils/ServicesTypes";

export const getGameHistory = async (nick: string) => {
  return handlePost(`${getGameHistoryLink}${nick}`).catch((error) => {
    throw new Error(error);
  });
};

export const getGameById = async (id: string) => {
  return handlePost(`${getGameByIdLink}${id}`).catch((error) => {
    throw new Error(error);
  });
};

export const listenForDrawOffer = async (id: string) => {
  return handlePost(`${listenForDrawOfferLink}${id}`).catch((error) => {
    throw new Error(error);
  });
};

export const offerDraw = async (id: string) => {
  return handlePost(`${offerDrawLink}${id}`).catch((error) => {
    throw new Error(error);
  });
};

export const respondToDrawOffer = async (
  respondToDrawOfferRequest: RespondToDrawOfferRequest
) => {
  return handlePost(`${respondToDrawOfferLink}`,JSON.stringify(respondToDrawOfferRequest) ).catch((error) => {
    throw new Error(error);
  });
};

export const listenForResignation = async (id: string) => {
  return handlePost(`${listenForResignationLink}${id}`).catch((error) => {
    throw new Error(error);
  });
}

export const resign = async (id: string) => {
  return handlePost(`${resignLink}${id}`).catch((error) => {
    throw new Error(error);
  });
}

export const getBoardByUsername = async (username: string) => {
  return handlePost(`${getBoardByUsername}${username}`).catch((error) => {
    throw new Error(error);
  });
}

export const isUserPlaying = async (username: string) => {
  return handlePost(`${isUserPlayingLink}${username}`).catch((error) => {
    throw new Error(error);
  });
}

export const isUserPlayingTimeControl = async (username: string, timeControl: string, increment:string) => {
  return handlePost(`${isUserPlayingTimeControlLink}${username}/${timeControl}/${increment}`).catch((error) => {
    throw new Error(error);
  });
}

export const ping = async (gameId: string) => {
  return handlePost(`${pingLink}${gameId}`).catch((error) => {
    throw new Error(error);
  });
}

export const listenForDisconnections = async (gameId: string) => {
  return handlePost(`${listenForDisconnectionLink}${gameId}`).catch((error) => {
    throw new Error(error);
  });
}