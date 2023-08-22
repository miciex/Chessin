import { View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import {
  twoFaEnabled,
  changePassword,
  remindPassword,
} from "../services/AuthenticationServices";
import {
  PasswordRemindRequest,
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
import { logoutUser } from "../services/userServices";
import { getValueFor } from "../utils/AsyncStoreFunctions";
import { User } from "../utils/PlayerUtilities";
type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "ResetPassword",
    undefined
  >;
  route: RouteProp<RootStackParamList, "ResetPassword">;
};

export default function ResetPasswordPage({ navigation }: Props) {
  const handleNotLoggedUser = () => {
    navigation.navigate("Login");
  };

  const getUserEmail = async () => {
    const userString = await getValueFor("user");
    if (userString === null) {
      handleNotLoggedUser();
      return;
    }
    const user = JSON.parse(userString) as User;
    if (!user || !user.email) {
      handleNotLoggedUser();
      return;
    }
    setEmail(user.email);
  };

  useEffect(() => {
    getUserEmail();
  }, []);

  const [email, setEmail] = useState<string>("");

  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordValid, setNewPasswordValid] = useState<boolean>(true);

  const [repeatNewPassword, setRepeatNewPassword] = useState<string>("");
  const [repeatNewPasswordValid, setRepeatNewPasswordValid] =
    useState<boolean>(true);

  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);

  const validateEmail = (): boolean => {
    return emailRegex.test(email);
  };

  const handleReminidPassword = async () => {
    const request: PasswordRemindRequest = {
      email,
      newPassword,
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
  ) : (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
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
        <View style={styles.submitButton}>
          <BaseButton text="Submit" handlePress={handleReminidPassword} />
        </View>
      </View>

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
