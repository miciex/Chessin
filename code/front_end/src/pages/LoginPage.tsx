import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

import InputField from "../features/login/components/InputField";
import Footer from "../components/Footer";
import LogInWithOtherFirm from "../features/login/components/LogInWithOtherFirm";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import Submit from "../features/login/components/Submit";

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
      <Footer navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignContent: "stretch",
  },
  formContainer: {
    marginTop: 100,
    flex: 8,
    alignItems: "center",
  },
});
