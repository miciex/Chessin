import AsynStorage from "@react-native-async-storage/async-storage";
import { User, responseUser } from "../utils/PlayerUtilities";
import {
  friendInvitation,
  findUsersByNickname,
  getFriends,
  checkInvitationsLink,
  getGameHistoryLink,
} from "../utils/ApiEndpoints";
import {
  CodeVerificationRequest,
  HandleFriendInvitation,
  HandleSearchBarSocials,
} from "../utils/ServicesTypes";
import {
  getHighestRanking,
  responseUserToUser,
} from "../utils/PlayerUtilities";
import { getValueFor, save } from "../utils/AsyncStoreFunctions";
import {
  addFriendLink,
  findByNicknameLink,
  refreshTokenLink,
  setActive,
} from "../utils/ApiEndpoints";
import { fetchandStoreUser } from "../features/authentication/services/loginServices";
import {
  AuthenticationResponse,
  FriendInvitationRequest,
} from "../utils/ServicesTypes";
import * as SecureStore from "expo-secure-store";
import { Rankings } from "../utils/PlayerUtilities";
import { GameType } from "../chess-logic/board";
import { handleFetch } from "../lib/fetch";

export const storeUser = async (value: User) => {
  await AsynStorage.setItem("user", JSON.stringify(value)).catch((err) => {
    throw new Error(err);
  });
  console.log("user stored");
};

// getting data
export const getUser = async () => {
  getValueFor("user")
    .then((user) => {
      if (user === null) return null;
      return JSON.parse(user);
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export const fetchUser = async (Nickname: string, email?: string) => {
  const token = await SecureStore.getItemAsync("accessToken");
  const user: any = await fetch(`${findByNicknameLink}${Nickname}`, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
  })
    .then((response) => {
      if (response.status === 200) return response.json();
      else if (response.status === 400) {
        throw new Error("Bad request");
      } else if (response.status === 401) {
        throw new Error("Unauthorized");
      } else {
        throw new Error("Something went wrong while fetching user");
      }
    })
    .then((data) => {
      return responseUserToUser(data, email ? email : "");
    })
    .catch((err) => {
      return {
        country: "none",
        firstname: "doesnt exist",
        lastname: "doesnt exist",
        email: "doesnt exist",
        nameInGame: "doesnt exist",
        highestRanking: 0,
        ranking: { blitz: 0, bullet: 0, rapid: 0, classical: 0 },
      };
    });

  return user;
};

export const setUserActive = async (active: boolean) => {
  const accessToken = await getValueFor("accessToken");
  let correct: boolean = false;

  await getValueFor("user")
    .then((userInfo) => {
      if (userInfo === null) return null;
      return JSON.parse(userInfo);
    })
    .then(async (user) => {
      if (user === null) return null;
      return fetch(`${setActive}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          isOnline: active,
        }),
      })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          throw new Error(error);
        });
    })
    .then((response) => {
      if (response === undefined || response === null) return null;
      correct = response.status === 200;
    })
    .catch((error) => {
      throw new Error(error);
    });
  return correct;
};

export const resetAccessToken = async () => {
  await AsynStorage.removeItem("accessToken");
  const refreshToken = await getValueFor("refreshToken");
  if (refreshToken === null) return;
  fetch(refreshTokenLink, {
    body: JSON.stringify({
      refreshToken: refreshToken,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json().catch((err) => {
          throw new Error(err);
        });
      } else {
        throw new Error("Something went wrong on api server!");
      }
    })
    .then(async (data) => {
      await AsynStorage.setItem("accessToken", data.accessToken);
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export const setUserDataFromResponse = async (
  responseData: AuthenticationResponse
) => {
  await save("refreshToken", responseData.refreshToken).catch((error) => {
    throw new Error(error);
  });
  await save("accessToken", responseData.accessToken).catch((error) => {
    throw new Error(error);
  });
  fetchandStoreUser().catch((error) => {
    throw new Error(error);
  });
};

export const addFriendFunc = async (request: FriendInvitationRequest) => {
  const accessToken = await getValueFor("accessToken");
  const response = await fetch(addFriendLink, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request),
  })
    .then(async(response) => {
      if (response.status === 200) {
        const msg = await response.json().catch((error) => {
          throw new Error(error);
        })
        return msg.message;
      } else {
        throw new Error("Something went wrong on api server!");
      }
    })
    .catch((error) => {
      console.error(error);
    });
  return response;
};

export const handleFriendInvitationFunc = async (
  request: HandleFriendInvitation
) => {
  const accessToken = await getValueFor("accessToken");
  const response = await fetch(friendInvitation, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request),
  })
    .then(async(response) => {
      if (response.status === 200) {
        const msg = await response.json().catch((error) =>{throw new Error(error)});
        return msg.message; 
      } else {
        throw new Error("Something went wrong on api server!");
      }
    })
    .catch((error) => {
      console.error(error);
    });
  return response;
};

export async function handleSearchBarSocials(request: HandleSearchBarSocials) {
  const accessToken = await getValueFor("accessToken");

  const response = await fetch(
    `${findUsersByNickname}${request.searchNickname}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json().catch((error) => {
          throw new Error(error);
        }) as unknown as Array<responseUser>;
      } else {
        throw new Error("Something went wrong on api server!");
      }
    })
    .catch((error) => {
      console.error(error);
    });
  return response;
}

export async function getFriendsList(nameInGame: string) {
  const accessToken = await getValueFor("accessToken");
  const response = await fetch(`${getFriends}${nameInGame}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json().catch((error) => {
          throw new Error(error);
        }) as unknown as Array<responseUser>;
      } else if (response.status === 400) {
        throw new Error("Bad request");
      } else if (response.status === 401) {
        throw new Error("Unauthorized");
      } else {
        throw new Error("Something went wrong");
      }
    })
    .catch((error) => {
      console.log("eror");
      console.error(error);
    });
  return response;
}

export const checkInvitations = async () => {
  const accessToken = await getValueFor("accessToken");

  const response = await fetch(checkInvitationsLink, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json().catch((error) => {
          throw new Error(error);
        }) as unknown as Array<responseUser>;
      } else if (response.status === 400) {
        throw new Error("Bad request");
      } else if (response.status === 401) {
        throw new Error("Unauthorized");
      } else {
        throw new Error("Something went wrong");
      }
    })
    .catch((error) => {
      throw new Error(error);
    });

  return response;
};

export const logoutUser = async () => {
  Promise.all([
    save("refreshToken", ""),
    save("accessToken", ""),
    save("user", ""),
  ])
    .then(() => {
      console.log("logged out succesfully");
    })
    .catch((err) => {
      throw new Error(err);
    });
};

export const updateUserRating = async (rating: number, gameType: GameType) => {
  const userJSON = await getValueFor("user");
  if (!userJSON)
    throw new Error("Couldn't update user rating, because user isn't stored");
  let user: User = await JSON.parse(userJSON);
  user.ranking[gameType] = rating;
  user.highestRanking = getHighestRanking(user.ranking);
  save("user", JSON.stringify(user));
};


export const getPagedGames = async (nameInGame:string, page:number) => {
  const accessToken = await getValueFor("accessToken").catch(() => {
    throw new Error(
      "Couldn't get game history, because accessToken isn't stored"
    );
  });

  return handleFetch(`${getGameHistoryLink}${nameInGame}/${page}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};