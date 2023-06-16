import AsynStorage from "@react-native-async-storage/async-storage";
import {responseUserToUser, User} from "../utils/PlayerUtilities";
import {getValueFor, save} from "../utils/AsyncStoreFunctions";
import {addFriend, findByNicknameLink, refreshTokenLink, setActive,} from "../utils/ApiEndpoints";
import {fetchandStoreUser} from "../features/authentication/services/loginServices";
import {AuthenticationResponse, CodeVerificationRequest, FriendInvitationRequest,} from "../utils/ServicesTypes";
import * as SecureStore from "expo-secure-store";

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

export const fetchUser = async (email: string, Nickname: string) => {
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
        throw new Error("Something went wrong");
      }
    })
    .then((data) => {
      return responseUserToUser(data, email);
    })
    .catch((err) => {
      throw new Error(err);
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
        return response.json();
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
  responseData: AuthenticationResponse,
  codeVerificationRequest: CodeVerificationRequest | { email: string }
) => {
  await save("refreshToken", responseData.refreshToken).catch((error) => {
    throw new Error(error);
  });
  await save("accessToken", responseData.accessToken).catch((error) => {
    throw new Error(error);
  });
  fetchandStoreUser(codeVerificationRequest.email).catch((error) => {
    throw new Error(error);
  });
};

export const addFriendFunc = async (request: FriendInvitationRequest) => {
  const accessToken = await getValueFor("accessToken");
  console.log(request);
  console.log(addFriend);
  return await fetch(addFriend, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request),
  })
      .then((response) => {
        if (response.status === 200) {
          console.log("send request");
          return response.text();
        } else {
          throw new Error("Something went wrong on api server!");
        }
      })
      .catch((error) => {
        console.error(error);
      });
};

export const logoutUser = async () => {
  Promise.all([
    save("refreshToken", undefined),
    save("accessToken", undefined),
    save("user", undefined),
  ])
    .then(() => {
      console.log("logged out succesfully");
    })
    .catch((err) => {
      throw new Error(err);
    });
};
