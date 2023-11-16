import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";

import { ColorsPallet } from "../utils/Constants";
import InputField from "../components/InputField";
import Friend from "../features/playWithFriend/components/Friend";
import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import Submit from "../features/login/components/Submit";
import {
  getFriendsList,
  handleSearchBarSocials,
  setUserDataFromResponse,
} from "../services/userServices";
import { HandleSearchBarSocials } from "../utils/ServicesTypes";
import { ResponseUser, responseUserToUser } from "../utils/PlayerUtilities";
import { User } from "../utils/PlayerUtilities";
import Heading from "../components/Heading";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "Avatar",
    undefined
  >;
  route: RouteProp<RootStackParamList, "Avatar">;
};

export default function AvatarPage({ route, navigation }: Props) {
  return (
    <View style={styles.appContainer}>
      <Heading text={"Avatars"} />
      <View style={styles.formContainer}>
        <ScrollView>
          <View style={styles.scrollView}></View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 8,
    alignItems: "center",
    backgroundColor: ColorsPallet.light,
    width: "90%",
  },
  appContainer: {
    backgroundColor: ColorsPallet.light,
    flex: 1,
    alignContent: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    alignItems: "center",
    marginLeft: "5%",
    width: "90%",
  },
});
