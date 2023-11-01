import { handleFetch } from "../lib/fetch";
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
  const accessToken = await getValueFor("accessToken").catch(() => {
    throw new Error(
      "Couldn't get game history, because accessToken isn't stored"
    );
  });
  return await fetch(`${getGameHistoryLink}${nick}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getGameById = async (id: string) => {
  const accessToken = await getValueFor("accessToken").catch(() => {
    throw new Error(
      "Couldn't get game history, because accessToken isn't stored"
    );
  });
  return await fetch(`${getGameByIdLink}${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const listenForDrawOffer = async (id: string) => {
  const accessToken = await getValueFor("accessToken").catch(() => {
    throw new Error(
      "Couldn't get game history, because accessToken isn't stored"
    );
  });
  
  return handleFetch(`${listenForDrawOfferLink}${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).catch((error) => {
    throw new Error(error);
  });
};

export const offerDraw = async (id: string) => {
  const accessToken = await getValueFor("accessToken").catch(() => {
    throw new Error(
      "Couldn't get game history, because accessToken isn't stored"
    );
  });

  return handleFetch(`${offerDrawLink}${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).catch((error) => {
    throw new Error(error);
  });
};

export const respondToDrawOffer = async (
  respondToDrawOfferRequest: RespondToDrawOfferRequest
) => {
  const accessToken = await getValueFor("accessToken").catch(() => {
    throw new Error(
      "Couldn't get game history, because accessToken isn't stored"
    );
  });

  return handleFetch(`${respondToDrawOfferLink}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(respondToDrawOfferRequest),
  });
};

export const listenForResignation = async (id: string) => {
  const accessToken = await getValueFor("accessToken").catch(() => {
    throw new Error(
      "Couldn't get game history, because accessToken isn't stored"
    );
  });

  return handleFetch(`${listenForResignationLink}${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).catch((error) => {
    throw new Error(error);
  });
}

export const resign = async (id: string) => {
  const accessToken = await getValueFor("accessToken").catch(() => {
    throw new Error(
      "Couldn't get game history, because accessToken isn't stored"
    );
  });

  return handleFetch(`${resignLink}${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).catch((error) => {
    throw new Error(error);
  });
}