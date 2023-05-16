import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import InputField from "../components/InputField";
import Footer from "../components/Footer";
import LogInWithOtherFirm from "../features/login/components/LogInWithOtherFirm";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import Submit from "../features/login/components/Submit";
import { ColorsPallet } from "../utils/Constants";
import useFetch from "../hooks/useFetch";
import { loginRequestType } from "../utils/ServicesTypes";
import { authLink } from "../utils/ServicesConstants";
import * as SecureStore from "expo-secure-store";
import AuthCodeModal from "../features/login/components/AuthCodeModal";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login", undefined>;
  route: RouteProp<RootStackParamList, "Login">;
};

export default function Login({ route, navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showAuthCode, setShowAuthCode] = useState<boolean>(false);

  const onSubmit = () => {
    setShowAuthCode(true);
    // fetch(authLink, {
    //   body: JSON.stringify({ email, password }),
    //   method: "POST",
    // })
    //   .then((response) => response.json())
    //   .then((responseData) => {
    //     if (responseData.refreshToken) {
    //       SecureStore.setItemAsync("refreshToken", responseData.refreshToken);
    //       SecureStore.setItemAsync("accesToken", responseData.accesToken);
    //     } else {
    //       setShowAuthCode(true);
    //     }
    //   })
    //   .then((responseData) => {
    //     navigation.navigate("Home");
    //   });
  };

  const hideModal = () => {
    setShowAuthCode(false);
  };

  return (
    <View style={styles.appContainer}>
      {showAuthCode ? <AuthCodeModal hideModal={hideModal} /> : null}
      <View style={styles.formContainer}>
        <InputField placeholder="Email" value={email} onChange={setEmail} />
        <InputField
          placeholder="Password"
          value={password}
          onChange={setPassword}
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
