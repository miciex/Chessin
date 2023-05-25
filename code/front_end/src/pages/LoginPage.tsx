import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useRef } from "react";
import InputField from "../components/InputField";
import Footer from "../components/Footer";
import LogInWithOtherFirm from "../features/login/components/LogInWithOtherFirm";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import Submit from "../features/login/components/Submit";
import { ColorsPallet } from "../utils/Constants";
import { authenticateLink } from "../utils/ServicesConstants";
import * as SecureStore from "expo-secure-store";
import AuthCodeModal from "../features/login/components/AuthCodeModal";
import { AuthenticationResponse } from "../utils/ServicesTypes";
import { fetchUser } from "../features/authentication/services/loginServices";
import { storeUser } from "../services/userServices";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login", undefined>;
  route: RouteProp<RootStackParamList, "Login">;
  setUser: (user: any) => void;
};

export default function Login({ route, navigation, setUser }: Props) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showAuthCode, setShowAuthCode] = useState<boolean>(false);

  const setUserDataFromResponse = async (
    responseData: AuthenticationResponse
  ) => {
    SecureStore.setItemAsync("refreshToken", responseData.refreshToken);
    SecureStore.setItemAsync("accesToken", responseData.accesToken);
    const user = await fetchUser(email);
    storeUser(user);
  };

  const onSubmit = () => {
    fetch(authenticateLink, {
      body: JSON.stringify({ email, password }),
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log(response);
          return response.json();
        } else if (response.status === 202) {
          setShowAuthCode(true);
          return null;
        } else if (response.status === 400) {
          throw new Error("Bad request");
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((responseData?: AuthenticationResponse) => {
        if (!responseData) return false;
        setUserDataFromResponse(responseData);
        return true;
      })
      .then((userSet: boolean) => {
        if (userSet) navigation.navigate("Home");
      });
  };

  const hideModal = () => {
    setShowAuthCode(false);
  };

  return (
    <View style={styles.appContainer}>
      {showAuthCode ? (
        <AuthCodeModal
          hideModal={hideModal}
          navigation={navigation}
          setUserDataFromResponse={setUserDataFromResponse}
        />
      ) : null}
      <View style={styles.formContainer}>
        <InputField placeholder="Email" value={email} onChange={setEmail} />
        <InputField
          placeholder="Password"
          value={password}
          onChange={setPassword}
          securityTextEntry={true}
        />
        <Submit onSubmit={onSubmit} />

        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <LogInWithOtherFirm brand="google" />
          <LogInWithOtherFirm brand="facebook" />
          <LogInWithOtherFirm brand="apple" />
        </View>
      </View>
      <Footer navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 8,
    alignItems: "center",
    backgroundColor: ColorsPallet.light,
    justifyContent: "center",
    width: "80%",
  },
  appContainer: {
    backgroundColor: ColorsPallet.light,
    flex: 1,
    alignContent: "stretch",
    alignItems: "center",
  },
});
