import { View, StyleSheet } from "react-native";
import React, { useState, useRef } from "react";
import Footer from "../components/Footer";
import LogInWithOtherFirm from "../features/login/components/LogInWithOtherFirm";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import Submit from "../features/login/components/Submit";
import { ColorsPallet } from "../utils/Constants";
import { authenticateLink } from "../utils/ApiEndpoints";
import AuthCodeModal from "../features/login/components/AuthCodeModal";
import { AuthenticationResponse } from "../utils/ServicesTypes";
import { fetchandStoreUser } from "../features/authentication/services/loginServices";
import { emailRegex, passwordRegex } from "../utils/Constants";
import AuthInput from "../features/authentication/components/AuthInput";
import {
  notValidEmailMessage,
  notValidPasswordMessage,
} from "../utils/Constants";
import { save, getValueFor } from "../utils/AsyncStoreFunctions";
import { responseUser, responseUserToUser } from "../utils/PlayerUtilities";
import { setUserDataFromResponse } from "../services/userServices";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login", undefined>;
  route: RouteProp<RootStackParamList, "Login">;
};

export default function Login({ route, navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState<string>("");
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null);
  const [showAuthCode, setShowAuthCode] = useState<boolean>(false);

  const validataEmail = (): boolean => {
    return emailRegex.test(email);
  };

  const validatePassword = (): boolean => {
    return passwordRegex.test(password);
  };

  const setPasswordValid = (): void => {
    setIsPasswordValid(validatePassword());
  };

  const setEmailValid = (): void => {
    setIsEmailValid(validataEmail());
  };

  const isDataValid = (): boolean => {
    return validataEmail() && validatePassword();
  };

  const onSubmit = () => {
    if (!isDataValid()) return;
    fetch(authenticateLink, {
      body: JSON.stringify({ email, password }),
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
    })
      .then((response) => {
        console.log(response.status);
        if (response.status === 200) {
          console.log(JSON.stringify(response));
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
        if (!responseData) {
          return false;
        }
        setUserDataFromResponse(responseData, email);
        return true;
      })
      .then((userSet: boolean) => {
        if (userSet) navigation.navigate("Home");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const hideModal = () => {
    setShowAuthCode(false);
  };

  return showAuthCode ? (
    <AuthCodeModal
      hideModal={hideModal}
      navigation={navigation}
      email={email}
      loginUser={true}
    />
  ) : (
    <View style={styles.appContainer}>
      <View style={styles.formContainer}>
        <AuthInput
          placeholder="Email"
          value={email}
          onChange={setEmail}
          isValid={isEmailValid}
          notValidText={notValidEmailMessage}
          onSubmitEditing={setEmailValid}
        />
        <AuthInput
          placeholder="Password"
          value={password}
          onChange={setPassword}
          securityTextEntry={true}
          isValid={isPasswordValid}
          notValidText={notValidPasswordMessage}
          onSubmitEditing={setPasswordValid}
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
    rowGap: 8,
  },
  appContainer: {
    backgroundColor: ColorsPallet.light,
    flex: 1,
    alignContent: "stretch",
    alignItems: "center",
  },
});
