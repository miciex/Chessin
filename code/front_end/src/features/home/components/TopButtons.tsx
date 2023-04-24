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
    <View>
      <View style={styles.authenticationButtonsContainer}>
        <AuthenticateButton navigation={navigation} text="Login" />
        <AuthenticateButton navigation={navigation} text="Register" />
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
  authenticationButtonsContainer: {
    flexDirection: "row",
  },
  playButtonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  playButtonContainer: {
    width: "80%",
    flexDirection: "row",
  },
});
