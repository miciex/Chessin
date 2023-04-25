import { View, Text, StyleSheet } from "react-native";
import React from "react";

import InputField from "../components/InputField";
import Submit from "../features/login/components/Submit";
import LogInWithOtherFirm from "../features/login/components/LogInWithOtherFirm";
import { ColorsPallet } from "../utils/Constants";

export default function Register() {
  return (
    <View style={styles.appContainer}>
      <View style={styles.formContainer}>
        <InputField placeholder="Your Nick" />
        <InputField placeholder="Email" />
        <InputField placeholder="Password" />
        <InputField placeholder="Repeat Password" />
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
