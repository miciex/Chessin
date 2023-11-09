import { View, ScrollView, StyleSheet } from "react-native";
import React, { useState } from "react";
import Submit from "../features/login/components/Submit";
import LogInWithOtherFirm from "../features/login/components/LogInWithOtherFirm";
import { ColorsPallet } from "../utils/Constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import AuthInput from "../features/authentication/components/AuthInput";
import Footer from "../components/Footer";
import { emailRegex, passwordRegex, nameRegex } from "../utils/Constants";
import {
  notValidEmailMessage,
  notValidPasswordMessage,
  notValidNameMessage,
  notValidNickMessage,
  notValidPasswordRepeatMessage,
  notValidSurnameMessage,
} from "../utils/Constants";
import ChooseCountry from "../features/register/ChooseCountry";
import { countryIsoCodesType } from "../features/playOnline";
import AuthCodeModal from "../features/login/components/AuthCodeModal";
import { VerificationType } from "../utils/ServicesTypes";
import { register } from "../services/AuthenticationServices";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Register">;
};

export default function Register({ navigation }: Props) {
  const [firstName, setFirstName] = useState<string>("");
  const [isFirstNameValid, setIsFirstNameValid] = useState<boolean | null>(
    null
  );
  const [lastName, setLastName] = useState<string>("");
  const [isLastNameValid, setIsLastNameValid] = useState<boolean | null>(null);
  const [nick, setNick] = useState<string>("");
  const [isNickValid, setIsNickValid] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState<string>("");
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null);
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [isRepeatPasswordValid, setIsRepeatPasswordValid] = useState<
    boolean | null
  >(null);
  const [country, setCountry] = useState<countryIsoCodesType>({
    Name: "Poland",
    Code: "PL",
  });
  const [isCountryScollViewVisible, setIsCountryScollViewVisible] =
    useState<boolean>(false);
  const [isCountryValid, setIsCountryValid] = useState<boolean | null>(null);
  const [showAuthCode, setShowAuthCode] = useState<boolean>(false);
  const [activeInput, setActiveInput] = useState<string>("");

  const hideAuthCodeModal = (): void => {
    setShowAuthCode(false);
  };

  const validateFirstName = (): boolean => {
    return nameRegex.test(firstName);
  };

  const setFirstNameValid = (): void => {
    setIsFirstNameValid(validateFirstName());
    setActiveInput("");
  };

  const validateLastName = (): boolean => {
    return nameRegex.test(lastName);
  };

  const setLastNameValid = (): void => {
    setIsLastNameValid(validateLastName());
    setActiveInput("");
  };

  const validateNick = (): boolean => {
    return nameRegex.test(nick);
  };

  const setNickValid = (): void => {
    setIsNickValid(validateNick());
    setActiveInput("");
  };

  const validataEmail = (): boolean => {
    return emailRegex.test(email);
  };

  const setPasswordValid = (): void => {
    setIsPasswordValid(validatePassword());
    setActiveInput("");
  };

  const validatePassword = (): boolean => {
    return passwordRegex.test(password);
  };

  const setEmailValid = (): void => {
    setIsEmailValid(validataEmail());
    setActiveInput("");
  };

  const validateRepeatPassword = (): boolean => {
    return password === repeatPassword;
  };

  const setRepeatPasswordValid = (): void => {
    setIsRepeatPasswordValid(validateRepeatPassword());
    setActiveInput("");
  };

  const validateCountry = (newCountry?: countryIsoCodesType): boolean => {
    if (newCountry) return Boolean(newCountry);
    return country !== undefined;
  };

  const setCountryValid = (newCountry?: countryIsoCodesType): void => {
    const valid = newCountry ? validateCountry(newCountry) : validateCountry();
    setIsCountryValid(valid);
    setActiveInput("");
  };

  const areInputsValid = (): boolean => {
    return (
      (isFirstNameValid &&
        isLastNameValid &&
        isNickValid &&
        isEmailValid &&
        isPasswordValid &&
        isRepeatPasswordValid &&
        isCountryValid) === true
    );
  };

  const setInputsValid = (): void => {
    setIsFirstNameValid(validateFirstName());
    setIsLastNameValid(validateLastName());
    setIsNickValid(validateNick());
    setIsEmailValid(validataEmail());
    setIsPasswordValid(validatePassword());
    setIsRepeatPasswordValid(validateRepeatPassword());
    setIsCountryValid(validateCountry());
  };

  const onSubmit = () => {
    setInputsValid();
    if (!areInputsValid()) return;
    register({
      email,
      password,
      lastname: lastName,
      firstname: firstName,
      nameInGame: nick,
      country: country.Name,
    })
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate("UserNotAuthenticated");
        } else if (response.status === 202) {
          setShowAuthCode(true);
        } else if (response.status === 400) {
          throw new Error("Bad request");
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const handleVerifyCodeResponse = async (response: Response) => {
    if (response.status === 200) {
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
  };

  return showAuthCode ? (
    <AuthCodeModal
      hideModal={hideAuthCodeModal}
      navigation={navigation}
      request={{
        email,
        verificationCode: "",
        verificationType: VerificationType.REGISTER,
        password,
        lastname: lastName,
        firstname: firstName,
        nameInGame: nick,
        country: country?.Name,
      }}
      handleVerifyCodeResponse={handleVerifyCodeResponse}
    />
  ) : (
    <View style={styles.appContainer}>
      <View style={styles.contentContainer}>
        {!isCountryScollViewVisible ? (
          <View style={styles.formContainer}>
            <AuthInput
              placeholder="Your Firstname"
              value={firstName}
              onChange={setFirstName}
              isValid={isFirstNameValid}
              onSubmitEditing={setFirstNameValid}
              notValidText={notValidNameMessage}
              onFocus={() => setActiveInput("Your Firstname")}
              activeInput={activeInput}
            />
            <AuthInput
              placeholder="Your LastName"
              value={lastName}
              onChange={setLastName}
              isValid={isLastNameValid}
              onSubmitEditing={setLastNameValid}
              notValidText={notValidSurnameMessage}
              onFocus={() => setActiveInput("Your LastName")}
              activeInput={activeInput}
            />
            <AuthInput
              placeholder="Your Nick"
              value={nick}
              onChange={setNick}
              isValid={isNickValid}
              onSubmitEditing={setNickValid}
              notValidText={notValidNickMessage}
              onFocus={() => setActiveInput("Your Nick")}
              activeInput={activeInput}
            />
            <AuthInput
              placeholder="Email"
              value={email}
              onChange={setEmail}
              isValid={isEmailValid}
              onSubmitEditing={setEmailValid}
              notValidText={notValidEmailMessage}
              onFocus={() => setActiveInput("Email")}
              activeInput={activeInput}
            />
            <AuthInput
              placeholder="Password"
              value={password}
              onChange={setPassword}
              securityTextEntry={true}
              isValid={isPasswordValid}
              onSubmitEditing={setPasswordValid}
              notValidText={notValidPasswordMessage}
              onFocus={() => setActiveInput("Password")}
              activeInput={activeInput}
            />
            <AuthInput
              placeholder="Repeat Password"
              value={repeatPassword}
              onChange={setRepeatPassword}
              securityTextEntry={true}
              isValid={isRepeatPasswordValid}
              onSubmitEditing={setRepeatPasswordValid}
              notValidText={notValidPasswordRepeatMessage}
              onFocus={() => setActiveInput("Repeat Password")}
              activeInput={activeInput}
            />
          </View>
        ) : null}
        {activeInput === "" ? (
          <View style={styles.chooseCountryContainer}>
            <ChooseCountry
              isVisible={isCountryScollViewVisible}
              setIsVisible={setIsCountryScollViewVisible}
              setCountry={setCountry}
              country={country}
              setCountryValid={setCountryValid}
            />
          </View>
        ) : null}
        {!isCountryScollViewVisible && activeInput === "" ? (
          <Submit onSubmit={onSubmit} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: ColorsPallet.light,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  ScrollView: {
    width: "100%",
    flex: 8,
  },
  appContainer: {
    backgroundColor: ColorsPallet.light,
    flex: 1,
    alignContent: "stretch",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 8,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  chooseCountryContainer: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
});
