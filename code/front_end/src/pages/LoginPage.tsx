import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import Footer from "../components/Footer";
import LogInWithOtherFirm from "../features/login/components/LogInWithOtherFirm";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import Submit from "../features/login/components/Submit";
import { ColorsPallet } from "../utils/Constants";
import AuthCodeModal from "../features/login/components/AuthCodeModal";
import {
  AuthenticationResponse,
  VerificationType,
} from "../utils/ServicesTypes";
import { emailRegex, passwordRegex } from "../utils/Constants";
import AuthInput from "../features/authentication/components/AuthInput";
import {
  notValidEmailMessage,
  notValidPasswordMessage,
} from "../utils/Constants";
import { setUserDataFromResponse } from "../services/userServices";
import { login } from "../services/AuthenticationServices";
import BaseButton from "../components/BaseButton";

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
    login({ email, password })
      .then((response) => {
        console.log(response.status);
        if (response.status === 200) {
          console.log(JSON.stringify(response));
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
              console.log(error);
            });
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((responseData?: AuthenticationResponse) => {
        if (!responseData) {
          return false;
        }
        setUserDataFromResponse(responseData, { email });
        return true;
      })
      .then((userSet: boolean) => {
        if (userSet) navigation.navigate("Home");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleVerifyCodeResponse = async (response: Response) => {
    console.log("status: ", response.status);
    if (response.status === 200) {
      console.log("correct code");
      response
        .json()
        .then((data) => {
          setUserDataFromResponse(data, { email });
          console.log("setting user data");
        })
        .then(() => {
          navigation.navigate("Home");
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
        </View>

        <View style={styles.logosContainer}>
          <LogInWithOtherFirm brand="google" />
          <LogInWithOtherFirm brand="facebook" />
          <LogInWithOtherFirm brand="apple" />
        </View>
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
              text="Register"
              handlePress={() => {
                navigation.navigate("Register");
              }}
              color={ColorsPallet.light}
            />
          </View>
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
    height: 70,
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
