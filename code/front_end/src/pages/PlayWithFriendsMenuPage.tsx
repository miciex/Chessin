import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";

import { ColorsPallet } from "../utils/Constants";
import SendInvitation from "../features/playOnline/components/SendInvitation";
import InputField from "../components/InputField";
import Friend from "../features/playOnline/components/Friend";
import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import Submit from "../features/login/components/Submit";

const friends = [
  {
    playerNick: "Pusznik",
    rank: 1500,
    active: false,
    playing: false,
    avatar: "",
  },
  {
    playerNick: "MaciekNieBij",
    rank: 1500,
    active: true,
    playing: true,
    avatar: "",
  },
  {
    playerNick: "Slaweczuk",
    rank: 1500,
    active: true,
    playing: false,
    avatar: "",
  },
  {
    playerNick: "Strzała",
    rank: 1500,
    active: false,
    playing: false,
    avatar: "",
  },
  {
    playerNick: "Bestia",
    rank: 1500,
    active: false,
    playing: false,
    avatar: "",
  },
  { playerNick: "Sharku", rank: 1000, active: true, playing: true, avatar: "" },
  {
    playerNick: "Zocho",
    rank: 1300,
    active: false,
    playing: false,
    avatar: "",
  },
  {
    playerNick: "Strzała",
    rank: 1500,
    active: false,
    playing: false,
    avatar: "",
  },
  {
    playerNick: "Bestia",
    rank: 1500,
    active: false,
    playing: false,
    avatar: "",
  },
  { playerNick: "Sharku", rank: 1000, active: true, playing: true, avatar: "" },
  {
    playerNick: "Zocho",
    rank: 1300,
    active: false,
    playing: false,
    avatar: "",
  },
  {
    playerNick: "Strzała",
    rank: 1500,
    active: false,
    playing: false,
    avatar: "",
  },
  {
    playerNick: "Bestia",
    rank: 1500,
    active: false,
    playing: false,
    avatar: "",
  },
  { playerNick: "Sharku", rank: 1000, active: true, playing: true, avatar: "" },
  {
    playerNick: "Zocho",
    rank: 1300,
    active: false,
    playing: false,
    avatar: "",
  },
];

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "PlayWithFriendsMenu",
    undefined
  >;
  route: RouteProp<RootStackParamList, "PlayWithFriendsMenu">;
};

export default function PlayWithFriendsMenu({ route, navigation }: Props) {
  return (
    <View style={styles.appContainer}>
      <View style={styles.formContainer}>
        <SendInvitation />
        <InputField placeholder="Search" />
        <ScrollView>
          <View style={styles.scrollView}>
            {friends.map((gracz) => (
              <Friend
                nick={gracz.playerNick}
                rank={gracz.rank}
                active={gracz.active}
                playing={gracz.playing}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      <Footer navigation={navigation} />
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
