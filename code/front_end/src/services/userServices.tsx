import AsynStorage from "@react-native-async-storage/async-storage";
import { User, ResponseUser } from "../utils/PlayerUtilities";

import {
  findUsersByNickname,
  getFriends,
  checkInvitationsLink,
  gameInvitation,
  getGameHistoryLink,
  checkSendedInvitationsLink,
  inviteToGameLink,
  checkInvitationsToGameLink,
  respondtoInvitationLink,
  getUsersLink,
} from "../utils/ApiEndpoints";
import {
  FriendInvitationResponse,
  GameInvitationResponse,
  HandleFriendInvitation,
  HandleSearchBarSocials,
  InviteToGameRequest,
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
import { GameType } from "../chess-logic/board";
import { handleFetch, handlePost } from "../lib/fetch";

export const storeUser = async (value: User) => {
  await AsynStorage.setItem("user", JSON.stringify(value)).catch((err) => {
    throw new Error(err);
  });
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

export const fetchUser = async (
  Nickname: string,
  email?: string
): Promise<User> => {
  return handlePost(`${findByNicknameLink}${Nickname}`)
    .then((data) => {
      return responseUserToUser(data, email ? email : "");
    })
    .catch(() => {
      throw new Error("Couldn't fetch user");
    });
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

  handleFetch(refreshTokenLink, {
    body: JSON.stringify({
      refreshToken: refreshToken,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  })
    .then(async (data) => {
      console.log("1");
      await AsynStorage.setItem("accessToken", data.accessToken);
    })
    .catch(() => {
      throw new Error("Couldn't reset access token");
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
  return handlePost(addFriendLink, JSON.stringify(request)).catch(() => {
    throw new Error("Couldn't add friend");
  });
};

export const handleFriendInvitationFunc = async (
  request: HandleFriendInvitation
) => {
  return handlePost(respondtoInvitationLink, JSON.stringify(request)).catch(
    (error) => {
      throw new Error(error);
    }
  );
};

export const answerToGameInvitation = async (
  request: HandleFriendInvitation
) => {
  return handlePost(gameInvitation, JSON.stringify(request)).catch((error) => {
    throw new Error(error);
  });
};

export async function handleSearchBarSocials(request: HandleSearchBarSocials) {
  return handlePost(`${findUsersByNickname}${request.searchNickname}`).catch(
    (error) => {
      throw new Error(error);
    }
  ) as unknown as Array<ResponseUser>;
}

export const checkInvitations = async () => {
  return handlePost(checkInvitationsLink).catch((error) => {
    throw new Error(error);
  }) as unknown as Array<FriendInvitationResponse>;
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
  const userJSON = await getValueFor("user").catch((error) => {
    throw new Error(error);
  });
  if (!userJSON)
    throw new Error("Couldn't update user rating, because user isn't stored");
  let user: User = await JSON.parse(userJSON);
  user.ranking[gameType] = rating;
  user.highestRanking = getHighestRanking(user.ranking);
  save("user", JSON.stringify(user)).catch((error) => {
    throw new Error(error);
  });
};

export const getFriendsList = async (nick: string) => {
  return handlePost(`${getFriends}${nick}`).catch((error) => {
    throw new Error(error);
  });
};

export const checkSendedInvitations = async () => {
  return handlePost(checkSendedInvitationsLink).catch((error) => {
    throw new Error(error);
  }) as unknown as Array<ResponseUser>;
};

export const inviteToGame = async (request: InviteToGameRequest) => {
  return handlePost(inviteToGameLink, JSON.stringify(request)).catch(
    (error) => {
      throw new Error(error);
    }
  );
};

export const checkInvitationsToGame = async () => {
  return handlePost(checkInvitationsToGameLink).catch((error) => {
    throw new Error(error);
  }) as unknown as Array<GameInvitationResponse>;
};

export const getPagedGames = async (nameInGame: string, page: number) => {
  return handlePost(`${getGameHistoryLink}${nameInGame}/${page}`).catch(
    (error) => {
      throw new Error(error);
    }
  );
};

export const getPagedFriends = async (nameInGame: string, page: number) => {
  return handlePost(`${getFriends}${nameInGame}/${page}`).catch((error) => {
    throw new Error(error);
  });
};

export const getPagedUsers = async (nickname: string, page: number) => {
  return handlePost(`${getUsersLink}${nickname}/${page}`).catch((error) => {
    throw new Error(error);
  });
};
