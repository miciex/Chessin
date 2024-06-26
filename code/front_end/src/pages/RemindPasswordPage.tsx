import { View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { remindPassword } from "../services/AuthenticationServices";
import { PasswordRemindRequest } from "../utils/ServicesTypes";
import {
  getPasswordErrorMessage,
  notValidPasswordRepeatMessage,
  emailRegex,
  ColorsPallet,
  containsNumbersRegex,
  containsSpecialCharactersRegex,
} from "../utils/Constants";
import AuthInput from "../features/authentication/components/AuthInput";
import BaseButton from "../components/BaseButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import AuthCodeModal from "../features/login/components/AuthCodeModal";
import { VerificationType } from "../utils/ServicesTypes";
import { logoutUser } from "../services/userServices";
import { getValueFor } from "../utils/AsyncStoreFunctions";
import { User } from "../utils/PlayerUtilities";
type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "RemindPassword",
    undefined
  >;
  route: RouteProp<RootStackParamList, "RemindPassword">;
  setUserNotAuthenticated: () => void;
};

export default function RemindPasswordPage({
  navigation,
  setUserNotAuthenticated,
}: Props) {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const handleLoggedUser = async () => {
    const userString = await getValueFor("user");
    if (!userString) {
      return;
    }
    const user = JSON.parse(userString) as User;
    if (!user || !user.email) {
      return;
    }
    setEmail(user.email);
    setLoggedIn(true);
  };

  useEffect(() => {
    handleLoggedUser();
  }, []);

  const [email, setEmail] = useState<string>("");
  const [emailValid, setEmailValid] = useState<boolean>(true);

  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordValid, setNewPasswordValid] = useState<boolean>(true);

  const [repeatNewPassword, setRepeatNewPassword] = useState<string>("");
  const [repeatNewPasswordValid, setRepeatNewPasswordValid] =
    useState<boolean>(true);

  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);
  const [activeInput, setActiveInput] = useState<string>("");

  const validateEmail = (): boolean => {
    return emailRegex.test(email);
  };

  const setIsEmailValid = (): void => {
    setEmailValid(validateEmail());
    setActiveInput("");
  };

  const isInputValid = () => {
    return validateEmail() && validateNewPassword() && validateRepeatPassword();
  };

  const handleRemindPassword = async () => {
    if (!isInputValid()) return;
    const request: PasswordRemindRequest = {
      email,
      newPassword,
    };
    remindPassword(request)
      .then((response) => {
        if (response.status === 202) {
          setLoggedIn(true);
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
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const handleVerifyCodeResponse = async (response: Response) => {
    //TODO: logoutUser
    if (response.status === 200) {
      logoutUser()
        .then(() => {
          setUserNotAuthenticated();
          navigation.navigate("UserNotAuthenticated");
        })
        .catch((err) => {
          throw new Error(err);
        });
    } else if (response.status === 400) {
      throw new Error("Invalid code");
    } else {
      throw new Error("Something went wrong");
    }
  };

  const validateNewPassword = (): boolean => {
    return (
      containsNumbersRegex.test(newPassword) &&
      containsSpecialCharactersRegex.test(newPassword) &&
      newPassword.toLowerCase() !== newPassword &&
      newPassword.toUpperCase() !== newPassword &&
      newPassword.length >= 12
    );
  };

  const setIsNewPasswordValid = (): void => {
    setNewPasswordValid(validateNewPassword());
    setActiveInput("");
  };

  const validateRepeatPassword = (): boolean => {
    return repeatNewPassword === newPassword;
  };

  const setIsRepeatNewPasswordValid = (): void => {
    setRepeatNewPasswordValid(validateRepeatPassword());
    setActiveInput("");
  };

  const hideModal = (): void => {
    setShowCodeModal(false);
  };

  const showModal = (): void => {
    setShowCodeModal(true);
  };

  const handleSubmit = (): void => {
    if (!isInputValid()) return;
    handleRemindPassword()
      .then(() => {
        showModal();
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const getModal = () => {
    return showCodeModal ? (
      <AuthCodeModal
        hideModal={hideModal}
        navigation={navigation}
        request={{
          newPassword: newPassword,
          email: email,
          verificationCode: "",
          verificationType: VerificationType.REMIND_PASSWORD,
        }}
        handleVerifyCodeResponse={handleVerifyCodeResponse}
      />
    ) : null;
  };

  const modal = getModal();
  return modal !== null ? (
    modal
  ) : (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <AuthInput
          placeholder="Email"
          value={email}
          onChange={setEmail}
          isValid={emailValid}
          notValidText="Email is not valid"
          onSubmitEditing={setIsEmailValid}
          onFocus={() => setActiveInput("Email")}
          activeInput={activeInput}
        />
        <>
          <AuthInput
            placeholder="New password"
            value={newPassword}
            onChange={setNewPassword}
            isValid={newPasswordValid}
            notValidText={notValidPasswordRepeatMessage}
            onSubmitEditing={setIsNewPasswordValid}
            onFocus={() => setActiveInput("Password")}
            activeInput={activeInput}
          ></AuthInput>
          <AuthInput
            placeholder="Repeat password"
            value={repeatNewPassword}
            onChange={setRepeatNewPassword}
            isValid={repeatNewPasswordValid}
            notValidText={getPasswordErrorMessage(repeatNewPassword)}
            onSubmitEditing={setIsRepeatNewPasswordValid}
            onFocus={() => setActiveInput("Repeat password")}
            activeInput={activeInput}
          ></AuthInput>
        </>
        {activeInput === "" ? (
          <View style={styles.submitButton}>
            <BaseButton text="Submit" handlePress={handleSubmit} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  submitButton: {
    width: "50%",
    height: 32,
  },
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    backgroundColor: ColorsPallet.lighter,
  },
  contentContainer: {
    width: "90%",
    flex: 8,
    alignItems: "center",
    gap: 32,
    justifyContent: "center",
  },
});
