import { getGameByIdLink, getGameHistoryLink } from "../utils/ApiEndpoints";
import { getValueFor } from "../utils/AsyncStoreFunctions";
import { User } from "../utils/PlayerUtilities";

export const getGameHistory = async (nick:string) => {
    const accessToken = await getValueFor("accessToken").catch(() => {
      throw new Error("Couldn't get game history, because accessToken isn't stored");
    });
    return await fetch(`${getGameHistoryLink}${nick}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }

export const getGameById = async (id:string) => {
  const accessToken = await getValueFor("accessToken").catch(() => {
    throw new Error("Couldn't get game history, because accessToken isn't stored");
  });
  return await fetch(`${getGameByIdLink}${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
}
