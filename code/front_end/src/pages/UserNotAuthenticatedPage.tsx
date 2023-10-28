import { View, Text, StyleSheet } from "react-native";
import React, {useContext} from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import BaseButton from "../components/BaseButton";
import { ColorsPallet } from "../utils/Constants";
import { UserLoggedInContext } from "../features/context/userloggedInContext";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "ProfilePage",
    undefined
  >;
};

export default function UserNotAuthenticatedPage({ navigation }: Props) {

  const userLoggedIn = useContext(UserLoggedInContext);

  if(userLoggedIn) {
    navigation.navigate("Home");
  }

  

  return (
    <View style={styles.mainContainer}>
        <Text style={styles.text}>You are not logged in</Text>
        <Text style={styles.text}>Log in to see your profile</Text>
        <View style={styles.buttonContainer}>
          <BaseButton
            handlePress={() => navigation.navigate("Login")}
            text="Log in"
            style={{ width: "50%" }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <BaseButton
            handlePress={() => navigation.navigate("Register")}
            text="Register"
            style={{ width: "50%" }}
          />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    gap: 20,
    paddingTop: 50,
    backgroundColor: ColorsPallet.lighter
  },
  buttonsContainer: {
    flex: 3,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: 55,
  },
  text: {
    fontSize: 24,
    fontWeight: "700",
    color: ColorsPallet.darker,
  }
});
