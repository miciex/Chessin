import { View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { remindPassword } from "../services/AuthenticationServices";
import { PasswordRemindRequest } from "../utils/ServicesTypes";
import {
  notValidPasswordMessage,
  notValidPasswordRepeatMessage,
  emailRegex,
  passwordRegex,
  ColorsPallet,
} from "../utils/Constants";
import AuthInput from "../features/authentication/components/AuthInput";
import BaseButton from "../components/BaseButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import Footer from "../components/Footer";
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
};

export default function RemindPasswordPage({ navigation }: Props) {
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
    console.log(user)
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

  const validateEmail = (): boolean => {
    return emailRegex.test(email);
  };

  const setIsEmailValid = (): void => {
    setEmailValid(validateEmail());
  };

  const isInputValid = () => {
    return validateEmail() && validateNewPassword() && validateRepeatPassword();
  };

  const handleRemindPassword = async () => {
    if (!isInputValid()) return;
    const request: PasswordRemindRequest = {
      email,
    };

    remindPassword(request)
      .then((response) => {
        if (response.status === 202) {
          setShowCodeModal(true);
        } else if (response.status === 200) {
          navigation.navigate("Home");
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
      return await response
        .text()
        .then(() => {
          logoutUser();
          navigation.navigate("Home");
        })
        .catch((err: any) => {
          throw new Error(err);
        });
    } else if (response.status === 400) {
      throw new Error("Invalid code");
    } else {
      throw new Error("Something went wrong");
    }
  };

  const validateNewPassword = (): boolean => {
    return passwordRegex.test(newPassword);
  };

  const setIsNewPasswordValid = (): void => {
    setNewPasswordValid(validateNewPassword());
  };

  const validateRepeatPassword = (): boolean => {
    return repeatNewPassword === newPassword;
  };

  const setIsRepeatNewPasswordValid = (): void => {
    setRepeatNewPasswordValid(validateRepeatPassword());
  };

  const hideModal = (): void => {
    setShowCodeModal(false);
  };

  const showModal = (): void => {
    setShowCodeModal(true);
  };

  const handleSubmit = (): void => {
    if (!loggedIn) {
      handleRemindPassword();
    } else showModal();
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
  console.log(loggedIn)
  return (
   modal !== null ? modal : (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <AuthInput
            placeholder="Email"
            value={email}
            onChange={setEmail}
            isValid={emailValid}
            notValidText="Email is not valid"
            onSubmitEditing={setIsEmailValid}
          />
          {loggedIn ? (
            <>
              <AuthInput
                placeholder="New password"
                value={newPassword}
                onChange={setNewPassword}
                isValid={newPasswordValid}
                notValidText={notValidPasswordMessage}
                onSubmitEditing={setIsNewPasswordValid}
              ></AuthInput>
              <AuthInput
                placeholder="Repeat password"
                value={repeatNewPassword}
                onChange={setRepeatNewPassword}
                isValid={repeatNewPasswordValid}
                notValidText={notValidPasswordRepeatMessage}
                onSubmitEditing={setIsRepeatNewPasswordValid}
              ></AuthInput>
            </>
          ) : null}
          <View style={styles.submitButton}>
            <BaseButton text="Submit" handlePress={handleSubmit} />
          </View>
        </View>

        <Footer navigation={navigation} />
      </View>
    )
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
