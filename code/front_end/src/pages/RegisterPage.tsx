import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

import InputField from "../components/InputField";
import Submit from "../features/login/components/Submit";
import LogInWithOtherFirm from "../features/login/components/LogInWithOtherFirm";
import { ColorsPallet } from "../utils/Constants";
import { registerLink } from "../utils/ServicesConstants";
import type { registerRequestType } from "../utils/ServicesTypes";
import useFetch from "../hooks/useFetch";

export default function Register() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [nick, setNick] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");

  const [data] = useFetch<registerRequestType>(
    registerLink,
    { firstName, lastName, nick, email, password },
    {
      body: JSON.stringify({ firstName, lastName, nick, email, password }),
      method: "POST",
    }
  );

  return (
    <View style={styles.appContainer}>
      <View style={styles.formContainer}>
        <InputField
          placeholder="Your Firstname"
          value={firstName}
          onChange={setFirstName}
        />
        <InputField
          placeholder="Your LastName"
          value={lastName}
          onChange={setLastName}
        />
        <InputField placeholder="Your Nick" value={nick} onChange={setNick} />
        <InputField placeholder="Email" value={email} onChange={setEmail} />
        <InputField
          placeholder="Password"
          value={password}
          onChange={setPassword}
        />
        <InputField
          placeholder="Repeat Password"
          value={repeatPassword}
          onChange={setRepeatPassword}
        />
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
