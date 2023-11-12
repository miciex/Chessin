import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { getValueFor, save } from "../utils/AsyncStoreFunctions";
import { resetAccessToken } from "../services/userServices";
import { fetchandStoreUser } from "../features/authentication/services/loginServices";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import { StackParamList } from "../utils/Constants";
import { User } from "../utils/PlayerUtilities";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "LoadingScreen",
    undefined
  >;
  route: RouteProp<RootStackParamList, "LoadingScreen">;
  setUserNotAuthenticated: () => void;
  setUserAuthenticated: () => void;
};

export default function LoadingScreen({
  navigation,
  setUserNotAuthenticated,
  setUserAuthenticated,
}: Props) {
  const redirectUserToGame = async (user?: User) => {
    if (user) {
      return navigation.navigate("Home");
    }
    const accepted = await getValueFor("termsOfServiceAccepted");
    if (!accepted) {
      return navigation.navigate("TermsOfService");
    } else {
      return navigation.navigate("UserNotAuthenticated");
    }
  };

  useEffect(() => {
    resetAccessToken()
      .then(() => {
        fetchandStoreUser().then((user) => {
          setUserAuthenticated();
          redirectUserToGame(user);
        });
      })
      .catch((err) => {
        save("user", "").catch(() => {
          throw new Error("Error while saving user");
        });
        redirectUserToGame();
        setUserNotAuthenticated();
        throw new Error(err);
      });
  }, []);

  return (
    <View>
      <Text>LoadingScreen</Text>
    </View>
  );
}
function setUserAuthenticated() {
  throw new Error("Function not implemented.");
}
