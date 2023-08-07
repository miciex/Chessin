import { View, StyleSheet } from "react-native";
import React from "react";
import AuthenticateButton from "./AuthenticateButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../Routing";
import PlayButton from "./PlayButton";
import BaseButton from "../../../components/BaseButton";
import { User } from "../../../utils/PlayerUtilities";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home", undefined>;
  user?: User
};

export default function TopButtons({ navigation , user}: Props) {
  return (
    <View style={styles.topButtonsContainer}>
      {
        user? "": <View style={styles.authenticationButtonsContainer}>
        <View style={styles.authButtonContainer}>
          <AuthenticateButton navigation={navigation} text="Register" />
        </View>
        <View style={styles.authButtonContainer}>
          <AuthenticateButton navigation={navigation} text="Login" />
        </View>
      </View>
      }
      

      <View style={styles.playButtonsContainer}>
        <View style={styles.playButtonContainer}>
          <PlayButton navigation={navigation} />
        </View>
      </View>
      <View style={styles.playButtonsContainer}>
        <View style={styles.playButtonContainer}>
          <BaseButton
            handlePress={() => {
              navigation.navigate("FreeBoard");
            }}
            text="Free Board"
          />
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
    height: 55,
  },
  playButtonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  playButtonContainer: {
    width: "80%",
    flexDirection: "row",
    height: 55,
  },
});
