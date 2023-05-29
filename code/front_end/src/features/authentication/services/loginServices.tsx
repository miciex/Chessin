import * as SecureStore from "expo-secure-store";
import { getUser } from "../../../utils/ServicesConstants";
import {
  User,
  responseUser,
  responseUserToUser,
} from "../../../utils/PlayerUtilities";
import { save } from "../../../utils/AsyncStoreFunctions";

export const fetchandStoreUser = async (email: string) => {
  return SecureStore.getItemAsync("accessToken")
    .then(async (token) => {
      let user: any;
      await fetch(`${getUser}${email}`, {
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
          console.log("user data: ", data);
          let user: User = responseUserToUser(data);
          console.log("changed user: ", user);
          save("user", JSON.stringify(user));
        })
        .catch((err) => {
          console.log(err);
        });
      return user;
    })
    .catch((err) => {
      console.log(err);
    });
};
