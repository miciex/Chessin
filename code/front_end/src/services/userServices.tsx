import AsynStorage from "@react-native-async-storage/async-storage";
import { User } from "../utils/PlayerUtilities";
import { getValueFor } from "../utils/AsyncStoreFunctions";

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
    if (user === null) return;
    return JSON.parse(user);
  });
};
