import * as SecureStore from "expo-secure-store";
import { getUser } from "../../../utils/ServicesConstants";

export const fetchUser = async (email: string) => {
  console.log("fetching user");
  const accessToken = await SecureStore.getItemAsync("accessToken");

  const response = await fetch(`${getUser}${email}`, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    }),
  });
  const data = await response.json();
  console.log("user data");
  console.log(data);
  return data;
};
