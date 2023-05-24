import AsynStorage from "@react-native-async-storage/async-storage";
import { User } from "../context/UserContext";

export const storeUser = async (value: User) => {
  try {
    await AsynStorage.setItem("user", JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
};

// getting data
export const getUser = async () => {
  try {
    const userData = JSON.parse((await AsynStorage.getItem("user")) || "{}");
    return userData !== "{}" ? userData : null;
  } catch (error) {
    console.log(error);
  }
  return null;
};
