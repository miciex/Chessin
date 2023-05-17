import * as SecureStore from "expo-secure-store";
import { getUser } from "../../../utils/ServicesConstants";

export const fetchUser = async (email: string) => {
  const accessToken = await SecureStore.getItemAsync("accessToken");
  const response = await fetch(`${getUser}${email}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data;
};
