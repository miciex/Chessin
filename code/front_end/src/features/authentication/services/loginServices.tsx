import * as SecureStore from "expo-secure-store";
import { findByEmailLink } from "../../../utils/ApiEndpoints";
import {
  User,
  responseUser,
  responseUserToUser,
} from "../../../utils/PlayerUtilities";
import { save } from "../../../utils/AsyncStoreFunctions";
import { fetchUser } from "../../../services/userServices";

export const fetchandStoreUser = async (email: string) => {
  return SecureStore.getItemAsync("accessToken")
    .then(async (token) => {
      let user: any;
      await fetch(`${findByEmailLink}${email}`, {
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
          console.log("user data: ", email);
          let user: User = responseUserToUser(data, email);
          console.log("changed user: ", user);
          save("user", JSON.stringify(user));
        })
        .catch((err) => {
          console.log("store user");
          console.log(err);
        });
      return user;
    })
    .catch((err) => {
      console.log(err);
    });
};

//fetchUser alternative implementation
// const fetchUser = async (email: string) => {
// const token = await SecureStore.getItemAsync("accessToken");
// const user: any = await fetch(`${findByEmail}${email}`, {
// method: "POST",
// headers: new Headers({
// "content-type": "application/json",
// Authorization: `Bearer ${token}`,
// });
// return responseUserToUser(user.json)

const storeUser = async (user: User) => {
  await save("user", JSON.stringify(user));
};
