import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import Submit from "../features/login/components/Submit";
import {
  ColorsPallet,
  containsNumbersRegex,
  containsSpecialCharactersRegex,
} from "../utils/Constants";
import AuthCodeModal from "../features/login/components/AuthCodeModal";
import {
  AuthenticationResponse,
  VerificationType,
} from "../utils/ServicesTypes";
import { emailRegex } from "../utils/Constants";
import AuthInput from "../features/authentication/components/AuthInput";
import {
  notValidEmailMessage,
  getPasswordErrorMessage,
} from "../utils/Constants";
import { setUserDataFromResponse } from "../services/userServices";
import { login } from "../services/AuthenticationServices";
import BaseButton from "../components/BaseButton";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login", undefined>;
  route: RouteProp<RootStackParamList, "Login">;
};

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState<string>("");
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null);
  const [showAuthCode, setShowAuthCode] = useState<boolean>(false);
  const [activeInput, setActiveInput] = useState<string>("");

  const validataEmail = (): boolean => {
    return emailRegex.test(email);
  };

  const validatePassword = (): boolean => {
    return (
      containsNumbersRegex.test(password) &&
      containsSpecialCharactersRegex.test(password) &&
      password.toLowerCase() !== password &&
      password.toUpperCase() !== password &&
      password.length >= 12
    );
  };

  const setPasswordValid = (): void => {
    setIsPasswordValid(validatePassword());
    setActiveInput("");
  };

  const setEmailValid = (): void => {
    setIsEmailValid(validataEmail());
    setActiveInput("");
  };

  const isDataValid = (): boolean => {
    return validataEmail() && validatePassword();
  };

  const onSubmit = () => {
    if (!isDataValid()) return;
    console.log("s");
    login({ email, password })
      .then((response) => {
        if (response.status === 200) {
          navigation.replace("Home");
          return response.json();
        } else if (response.status === 202) {
          setShowAuthCode(true);
          return null;
        } else if (response.status === 400) {
          response
            .text()
            .then((text) => {
              throw new Error(text);
            })
            .catch((error) => {
              throw new Error(error);
            });
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((responseData?: AuthenticationResponse) => {
        if (!responseData) {
          return false;
        }
        setUserDataFromResponse(responseData);
        return true;
      })
      .then((userSet: boolean) => {
        if (userSet) navigation.navigate("Home");
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const handleVerifyCodeResponse = async (response: Response) => {
    if (response.status === 200) {
      response
        .json()
        .then((data) => {
          setUserDataFromResponse(data)
            .then(() => {
              navigation.replace("Home");
            })
            .catch((err) => {
              throw new Error(err);
            });
        })
        .catch((err) => {
          throw new Error(err);
        });
    } else if (response.status === 400) {
      response
        .text()
        .then((data) => {
          throw new Error(data);
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  };

  const hideModal = () => {
    setShowAuthCode(false);
  };

  return showAuthCode ? (
    <AuthCodeModal
      hideModal={hideModal}
      navigation={navigation}
      request={{
        email: email,
        verificationCode: "",
        verificationType: VerificationType.AUTHENTICATE,
      }}
      handleVerifyCodeResponse={handleVerifyCodeResponse}
    />
  ) : (
    <View style={styles.appContainer}>
      <View style={styles.formContainer}>
        <View style={styles.inputsContainer}>
          <AuthInput
            placeholder="Email"
            value={email}
            onChange={setEmail}
            isValid={isEmailValid}
            notValidText={notValidEmailMessage}
            onSubmitEditing={setEmailValid}
            onFocus={() => setActiveInput("Email")}
            activeInput={activeInput}
          />
          <AuthInput
            placeholder="Password"
            value={password}
            onChange={setPassword}
            securityTextEntry={true}
            isValid={isPasswordValid}
            notValidText={getPasswordErrorMessage(password)}
            onSubmitEditing={setPasswordValid}
            onFocus={() => setActiveInput("Password")}
            activeInput={activeInput}
          />
          {activeInput === "" ? <Submit onSubmit={onSubmit} /> : null}
        </View>
        {activeInput === "" ? (
          <View style={styles.authLinksContainer}>
            <View style={styles.authLinkButton}>
              <BaseButton
                text="Reset your password"
                handlePress={() => {
                  navigation.navigate("ResetPassword");
                }}
                color={ColorsPallet.light}
              />
            </View>
            <View style={styles.authLinkButton}>
              <BaseButton
                text="Remind password"
                handlePress={() => {
                  navigation.navigate("RemindPassword");
                }}
                color={ColorsPallet.light}
              />
            </View>
            <View style={styles.authLinkButton}>
              <BaseButton
                text="Register"
                handlePress={() => {
                  navigation.navigate("Register");
                }}
                color={ColorsPallet.light}
              />
            </View>
          </View>
        ) : null}
      </View>
      {/* <Footer navigation={navigation} /> */}
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
  logosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  appContainer: {
    backgroundColor: ColorsPallet.light,
    flex: 1,
    alignContent: "stretch",
    alignItems: "center",
  },
  authLinksContainer: {
    width: "100%",
    height: 105,
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  inputsContainer: {
    width: "100%",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
    flex: 3,
  },
  authLinkButton: {
    width: "60%",
    height: 24,
    overflow: "hidden",
    alignItems: "center",
  },
});
