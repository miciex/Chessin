import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import {
  twoFaEnabled,
  changePassword,
  verifyCode,
} from "../services/AuthenticationServices";
import {
  CodeVerificationRequest,
  TwoFactorAuthenticationResponse,
} from "../utils/ServicesTypes";
import {
  notValidEmailMessage,
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

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "ResetPassword",
    undefined
  >;
  route: RouteProp<RootStackParamList, "ResetPassword">;
};

export default function ResetPasswordPage({ navigation, route }: Props) {
  const [email, setEmail] = useState<string>("");
  const [emailValid, setEmailValid] = useState<boolean>(true);

  const [password, setPassword] = useState<string>("");
  const [passwordValid, setPasswordValid] = useState<boolean>(true);

  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordValid, setNewPasswordValid] = useState<boolean>(true);

  const [repeatNewPassword, setRepeatNewPassword] = useState<string>("");
  const [repeatNewPasswordValid, setRepeatNewPasswordValid] =
    useState<boolean>(true);

  const [isTwoFaEnabled, setIsTwoFaEnabled] = useState<boolean>(false);
  const [isTwoFaChecked, setIsTwoFaChecked] = useState<boolean>(false);

  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);

  const validateEmail = (): boolean => {
    return emailRegex.test(email);
  };

  const checkIs2faEnabled = () => {
    const emailValid = validateEmail();
    setEmailValid(emailValid);
    if (!emailValid) return;
    twoFaEnabled({ email })
      .then((response) => {
        if (response.status === 200) {
          return response.text() as unknown as TwoFactorAuthenticationResponse;
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
      .then((data) => {
        if (data !== undefined)
          setIsTwoFaEnabled(data === "True" ? true : false);
        setIsTwoFaChecked(true);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const resetPassword = () => {
    const request = isTwoFaEnabled
      ? { email }
      : { email, password, newPassword };
    changePassword(request)
      .then((response) => {
        if (response.status === 202) {
          setShowCodeModal(true);
          console.log("code sent");
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
      return response
        .text()
        .then((data) => {
          console.log(data);
          navigation.navigate("Home");
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

  const setIsEmailValid = (): void => {
    setEmailValid(validateEmail());
  };

  const validatePassword = (): boolean => {
    return passwordRegex.test(password);
  };

  const setIsPasswordValid = (): void => {
    setPasswordValid(validatePassword());
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

  return showCodeModal ? (
    <AuthCodeModal
      hideModal={hideModal}
      navigation={navigation}
      request={{
        password: password,
        newPassword: newPassword,
        email: email,
        verificationCode: "",
        verificationType: VerificationType.CHANGE_PASSWORD,
      }}
      handleVerifyCodeResponse={handleVerifyCodeResponse}
    />
  ) : (
    <View style={styles.container}>
      {isTwoFaChecked ? (
        <View style={styles.contentContainer}>
          <AuthInput
            placeholder="oldPassword"
            value={password}
            onChange={setPassword}
            isValid={passwordValid}
            notValidText={notValidPasswordMessage}
            onSubmitEditing={setIsPasswordValid}
          ></AuthInput>
          <AuthInput
            placeholder="Password"
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
          <View style={styles.submitButton}>
            <BaseButton text="Submit" handlePress={resetPassword} />
          </View>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <AuthInput
            placeholder="Email"
            value={email}
            onChange={setEmail}
            isValid={emailValid}
            notValidText={notValidEmailMessage}
            onSubmitEditing={setIsEmailValid}
          ></AuthInput>
          <View>
            <View style={styles.submitButton}>
              <BaseButton
                text="Submit"
                handlePress={checkIs2faEnabled}
              ></BaseButton>
            </View>
          </View>
        </View>
      )}
      <Footer navigation={navigation} />
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
