import AsynStorage from "@react-native-async-storage/async-storage";
import { User } from "../utils/PlayerUtilities";

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
  try {
    console.log("getting user");
    const user = await AsynStorage.getItem("user");
    console.log(user);
    const userData = JSON.parse(user ? user : "");
    console.log("user logged");
    console.log(user);
    return userData ? userData : null;
  } catch (error) {
    console.log(error);
  }
  return null;
};
