import { View, StyleSheet } from "react-native";
import React from "react";
import AuthenticateButton from "./AuthenticateButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../Routing";
import PlayButton from "./PlayButton";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home", undefined>;
};

export default function TopButtons({ navigation }: Props) {
  return (
    <View style={styles.topButtonsContainer}>
      <View style={styles.authenticationButtonsContainer}>
        <View style={styles.authButtonContainer}>
          <AuthenticateButton navigation={navigation} text="Register" />
        </View>
        <View style={styles.authButtonContainer}>
          <AuthenticateButton navigation={navigation} text="Login" />
        </View>
      </View>
      <View style={styles.playButtonsContainer}>
        <View style={styles.playButtonContainer}>
          <PlayButton navigation={navigation} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topButtonsContainer: {
    width: "100%",
    flex: 2,
    rowGap: 16,
  },
  authenticationButtonsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
  },
  authButtonContainer: {
    width: "40%",
    height: 32,
  },
  playButtonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  playButtonContainer: {
    width: "80%",
    flexDirection: "row",
    height: 32,
  },
});
