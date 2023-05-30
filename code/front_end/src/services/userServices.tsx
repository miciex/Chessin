import AsynStorage from "@react-native-async-storage/async-storage";
import { User } from "../utils/PlayerUtilities";
import { getValueFor } from "../utils/AsyncStoreFunctions";
import { setActive } from "../utils/ServicesConstants";
import { responseUserToUser } from "../utils/PlayerUtilities";

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

export const setUserActive = async (active: boolean) => {
  const accessToken = await getValueFor("accessToken");
  let correct: boolean = false;
  await getValueFor("user")
    .then((userInfo) => {
      if (userInfo === null) return null;
      return responseUserToUser(JSON.parse(userInfo));
    })
    .then(async (user) => {
      if (user === null) return null;
      return fetch(`${setActive}${user.email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          active: active,
        }),
      }).catch((error) => console.log(error));
    })
    .then((response) => {
      if (response === undefined || response === null) return null;
      if (response.status === 200) {
        console.log("user active status changed");
        correct = true;
      } else {
        console.log("user active status not changed");
        correct = false;
      }
    })
    .catch((error) => console.log(error));
  return correct;
};
