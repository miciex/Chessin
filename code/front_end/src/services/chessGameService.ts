import { handleFetch, handlePost } from "../lib/fetch";
import {
  getGameByIdLink,
  getGameHistoryLink,
  listenForDrawOfferLink,
  listenForResignationLink,
  offerDrawLink,
  resignLink,
  respondToDrawOfferLink,
} from "../utils/ApiEndpoints";
import { getValueFor } from "../utils/AsyncStoreFunctions";
import { User } from "../utils/PlayerUtilities";
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