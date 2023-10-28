import { getGameHistoryLink } from "../utils/ApiEndpoints";
import { getValueFor } from "../utils/AsyncStoreFunctions";
import { User } from "../utils/PlayerUtilities";

export const getGameHistory = async (nick:string) => {
    const accessToken = await getValueFor("accessToken").catch(() => {
      throw new Error("Couldn't get game history, because accessToken isn't stored");
    });
    console.log("fetching game history: "+ `${getGameHistoryLink}${nick}`)
    console.log(`${getGameHistoryLink}${nick}`)
    return await fetch(`${getGameHistoryLink}${nick}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }

