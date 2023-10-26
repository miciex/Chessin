import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import BaseButton from "../components/BaseButton";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "ProfilePage",
    undefined
  >;
};

export default function UserNotAuthenticatedPage({ navigation }: Props) {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.textContainer}>
        <Text>You are not logged in</Text>
        <Text>Log in to see your profile</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <BaseButton
          handlePress={() => navigation.navigate("Login")}
          text="Log in"
          style={{ width: "50%" }}
        />
        <BaseButton
          handlePress={() => navigation.navigate("Register")}
          text="Register"
          style={{ width: "50%" }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
  },
  buttonsContainer: {
    flex: 3,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
