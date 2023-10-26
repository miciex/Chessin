import { View, StyleSheet } from "react-native";
import React from "react";
import BaseButton from "./BaseButton";
import { logoutUser } from "../services/userServices";
import { useState } from "react";
import { ColorsPallet } from "../utils/Constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { StackParamList } from "../utils/Constants";

type Props = {
    navigation: NativeStackNavigationProp<
    RootStackParamList,
    StackParamList,
    undefined
  >;
}

export default function LogoutButton({ navigation}:Props) {
  const [showVerification, setShowVerification] = useState(false);

  const toggleShowVerification = () => {
    setShowVerification(!showVerification);
  };

  const handleLogout = () => {
    navigation.navigate("Home")
    logoutUser();
  }

  return (
    <View style={styles.container}>
      
      {showVerification ? (
        <View style={styles.confirmLogoutContainer}>
          <BaseButton
            handlePress={handleLogout}
            text="Confirm"
            style={styles.confirmLogout}
            fontColor={ColorsPallet.green}
          />
          <BaseButton handlePress={toggleShowVerification} text="Reject" style={styles.confirmLogout}
          fontColor={ColorsPallet.red}/>
        </View>
      ):<BaseButton
      handlePress={toggleShowVerification}
      text="Log out"
      style={styles.logout}
      fontColor={ColorsPallet.red}
    />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  logout: {
    backgroundColor: "red",
    width: "90%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmLogoutContainer: {
    width: "100%",
    justifyContent: "space-evenly",
    flexDirection: "row",
    height: 50,
  },
  confirmLogout: {
    width: "25%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
