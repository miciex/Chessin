import AsynStorage from "@react-native-async-storage/async-storage";
import { User } from "../utils/PlayerUtilities";
import { getValueFor } from "../utils/AsyncStoreFunctions";
import { setActive } from "../utils/ApiEndpoints";
import { responseUserToUser } from "../utils/PlayerUtilities";
import { refreshTokenLink, findByEmailLink } from "../utils/ApiEndpoints";
import { save } from "../utils/AsyncStoreFunctions";
import { fetchandStoreUser } from "../features/authentication/services/loginServices";
import { AuthenticationResponse } from "../utils/ServicesTypes";
import * as SecureStore from "expo-secure-store";
import { CodeVerificationRequest } from "../utils/ServicesTypes";

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
        .catch((error) => {
          throw new Error(error);
        });
    })
    .then((response) => {
      if (response === undefined || response === null) return null;
      if (response.status === 200) {
        correct = true;
      } else {
        correct = false;
      }
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
