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
      let user: User = loggedUserToUser(data);
      console.log("user: " + user.nameInGame)
      save("user", JSON.stringify(user));
      return user;
    })
    .catch((err) => {
      console.log("failed to fetch user.")
      throw new Error(err);
    });
};

export const fetchLoggedUser = async () => {
  const accessToken = await getValueFor("accessToken");
  console.log("access token: "+accessToken)
  if (accessToken === null) throw new Error("user is not logged in");
  console.log("fetching user...");
  return fetch(findUserbyTokenLink, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    }),
  })
    .then((response) => {
      if (response.status === 200){
        return response.json().catch(err=>{
          console.log("failded to parse response")
          throw new Error(err)
        }) as unknown as loggedUserResponse;
      }
      else if (response.status === 400) {
        throw new Error("Bad request");
      } else if (response.status === 401) {
        throw new Error("Unauthorized");
      } else {
        throw new Error("Something went wrong while fetching logged user");
      }
    })
    .catch((err) => {
      console.log("Fetch logged user failed");
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
