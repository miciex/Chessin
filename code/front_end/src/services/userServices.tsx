import AsynStorage from "@react-native-async-storage/async-storage";
import { User } from "../utils/PlayerUtilities";
import { getValueFor } from "../utils/AsyncStoreFunctions";
import { setActive } from "../utils/ApiEndpoints";
import { responseUserToUser } from "../utils/PlayerUtilities";
import { refreshTokenLink, findByEmailLink } from "../utils/ApiEndpoints";
import { save } from "../utils/AsyncStoreFunctions";
import { fetchandStoreUser } from "../features/authentication/services/loginServices";
import { AuthenticationResponse, CodeVerificationRequest , FriendInvitationRequest} from "../utils/ServicesTypes";
import * as SecureStore from "expo-secure-store";
import { addFriend } from "../utils/ApiEndpoints";

export const storeUser = async (value: User) => {
  try {
    await AsynStorage.setItem("user", JSON.stringify(value));
    console.log("user stored");
  } catch (error) {
    console.log(error);
  }
};

// getting data
export const getUser = async () => {
  getValueFor("user").then((user) => {
    if (user === null) return null;
    return JSON.parse(user);
  });
};

export const fetchUser = async (email: string) => {
  const token = await SecureStore.getItemAsync("accessToken");
  const user: any = await fetch(`${findByEmailLink}${email}`, {
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
      console.log("store user");
      console.log(err);
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
      return fetch(`${setActive}${user.email}`, {
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
        .catch((error) => console.log(error));
    })
    .then((response) => {
      console.log(response);
      if (response === undefined || response === null) return null;
      if (response.status === 200) {
        correct = true;
      } else {
        correct = false;
      }
    })
    .catch((error) => console.log(error));
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
      console.error(error);
    });
};

export const setUserDataFromResponse = async (
  responseData: AuthenticationResponse,
  codeVerificationRequest: CodeVerificationRequest | { email: string }
) => {
  await save("refreshToken", responseData.refreshToken);
  await save("accessToken", responseData.accessToken);
  fetchandStoreUser(codeVerificationRequest.email);
};


export const addFriendFunc = async (request: FriendInvitationRequest) =>{
  const accessToken = await getValueFor("accessToken");
  console.log(request)
  console.log(addFriend)
  const response = await fetch(addFriend, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request)
  })
  .then((response) => {
    if (response.status === 200) {
      console.log("send request")
      return response.text();
    } else {
      throw new Error("Something went wrong on api server!");
    }
  })
  .catch((error) => {
    console.error(error);
  });
  return response;
}