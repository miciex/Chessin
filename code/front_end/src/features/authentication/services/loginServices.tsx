import * as SecureStore from "expo-secure-store";
import { findUserbyTokenLink } from "../../../utils/ApiEndpoints";
import { User, loggedUserToUser } from "../../../utils/PlayerUtilities";
import { save } from "../../../utils/AsyncStoreFunctions";
import { loggedUserResponse } from "../../../utils/ServicesTypes";
import { getValueFor } from "../../../utils/AsyncStoreFunctions";
export const fetchandStoreUser = async () => {
  console.log("fetching user");
  return fetchLoggedUser()
    .then((data) => {
      console.log("got user data: ", data);
      let user: User = loggedUserToUser(data);
      console.log("changed user: ", user);
      save("user", JSON.stringify(user));
      return user;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

export const fetchLoggedUser = async () => {
  const accessToken = await getValueFor("accessToken");
  if (accessToken === null) throw new Error("user is not logged in");
  return fetch(findUserbyTokenLink, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    }),
  })
    .then((response) => {
      if (response.status === 200)
        return response.json() as unknown as loggedUserResponse;
      else if (response.status === 400) {
        throw new Error("Bad request");
      } else if (response.status === 401) {
        throw new Error("Unauthorized");
      } else {
        throw new Error("Something went wrong while fetching logged user");
      }
    })
    .catch((err) => {
      throw new Error(err);
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
