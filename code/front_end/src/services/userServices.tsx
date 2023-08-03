import AsynStorage from "@react-native-async-storage/async-storage";
import { User, responseUser } from "../utils/PlayerUtilities";
import { getValueFor } from "../utils/AsyncStoreFunctions";
import { responseUserToUser } from "../utils/PlayerUtilities";
import {
  refreshTokenLink,
  findByNicknameLink,
  setActive,
  friendInvitation,
  findUsersByNickname,
  addFriendLink,
  getFriends,
  checkInvitationsLink
} from "../utils/ApiEndpoints";
import { save } from "../utils/AsyncStoreFunctions";
import { fetchandStoreUser } from "../features/authentication/services/loginServices";
import { AuthenticationResponse, CodeVerificationRequest , FriendInvitationRequest, HandleFriendInvitation, HandleSearchBarSocials} from "../utils/ServicesTypes";
import * as SecureStore from "expo-secure-store";

export const storeUser = async (value: User) => {
  console.log(value + "value")
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

export const fetchUser = async ( Nickname: string, email?: string) => {
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
      return responseUserToUser(data, email ? email : "");
    })
    .catch((err) => {
      return {country: "none", firstname: "doesnt exist", lastname: "doesnt exist", email: "doesnt exist", nameInGame: "doesnt exist", highestRanking: 0, ranking: {blitz: 0, bullet: 0, rapid: 0, classical: 0}};
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
  const response = await fetch(addFriendLink, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request),
  })
  .then((response) => {
    if (response.status === 200) {
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


export const handleFriendInvitationFunc = async (request: HandleFriendInvitation) =>{
  const accessToken = await getValueFor("accessToken");
  const response = await fetch(friendInvitation, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request)
  })
  .then((response) => {
    if (response.status === 200) {
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


export async function handleSearchBarSocials (request: HandleSearchBarSocials){
  const accessToken = await getValueFor("accessToken");

  const response = await fetch(`${findUsersByNickname}${request.searchNickname}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    }
  })
  .then((response) => {
    
    if (response.status === 200) {
      return response.json() as unknown as Array<responseUser>;
        } else {
      throw new Error("Something went wrong on api server!");
    }
  })
  .catch((error) => {
    console.error(error);
  });
  return response;
}


export async function getFriendsList  (nameInGame:string){
  const accessToken = await getValueFor("accessToken");
  const response = await fetch(`${getFriends}${nameInGame}`,{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    }
  }).then((response) => {
    if (response.status === 200) {
      return response.json() as unknown as Array<responseUser>;
        } else if (response.status === 400) {
          throw new Error("Bad request");
        } else if (response.status === 401) {
          throw new Error("Unauthorized");
        } else {
          throw new Error("Something went wrong");
        }
  })
  .catch((error) => {
    console.log("eror")
    console.error(error);
  });
  return response;
}


export const checkInvitations = async () =>{
  const accessToken = await getValueFor("accessToken");
  console.log(checkInvitationsLink + " acces")
  
  const response = await fetch(checkInvitationsLink,{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    }
  }).then((response) => {
    if (response.status === 200) {
    
      return response.json() as unknown as Array<responseUser>;
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
}


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
