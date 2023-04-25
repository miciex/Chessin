import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import InputField from "../components/InputField";
import Footer from "../components/Footer";
import LogInWithOtherFirm from "../features/login/components/LogInWithOtherFirm";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import Submit from "../features/login/components/Submit";
import { ColorsPallet } from "../utils/Constants";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login", undefined>;
  route: RouteProp<RootStackParamList, "Login">;
};

export default function Login({ route, navigation }: Props) {
  console.log("login");
  return (
    <View style={styles.appContainer}>
      <View style={styles.formContainer}>
        <InputField placeholder="Email" />
        <InputField placeholder="Password" />
        <Submit />

        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <LogInWithOtherFirm brand="google" />
          <LogInWithOtherFirm brand="facebook" />
          <LogInWithOtherFirm brand="apple" />
        </View>
      </View>
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
