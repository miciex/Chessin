import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";

import Profile from "../features/playWithFriend/components/Profile";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import EndedGame from "../features/home/components/EndedGame";
import Heading from "../components/Heading";
import FriendsIconList from "../features/playWithFriend/components/FriendsIconList";
import SendInvitation from "../features/playWithFriend/components/SendInvitation";
import BaseButton from "../components/BaseButton";

const ended_games = [
  {
    date: "01.10.2022",
    playerNick: "Pusznik",
    rank: 1500,
    lastGameResult: "win",
  },
  {
    date: "01.10.2022",
    playerNick: "MaciekNieBij",
    rank: 1500,
    lastGameResult: "win",
  },
  {
    date: "01.10.2022",
    playerNick: "Slaweczuk",
    rank: 1500,
    lastGameResult: "win",
  },
  {
    date: "01.10.2022",
    playerNick: "Strzała",
    rank: 1500,
    lastGameResult: "lose",
  },
  {
    date: "01.10.2022",
    playerNick: "Bestia",
    rank: 1500,
    lastGameResult: "win",
  },
  {
    date: "01.10.2022",
    playerNick: "Sharku",
    rank: 1000,
    lastGameResult: "lose",
  },
  {
    date: "01.10.2022",
    playerNick: "Zocho",
    rank: 1300,
    lastGameResult: "draw",
  },
  {
    date: "01.10.2022",
    playerNick: "Zocho",
    rank: 1300,
    lastGameResult: "draw",
  },
  {
    date: "01.10.2022",
    playerNick: "Zocho",
    rank: 1300,
    lastGameResult: "draw",
  },
  {
    date: "01.10.2022",
    playerNick: "Zocho",
    rank: 1300,
    lastGameResult: "draw",
  },
];

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "ProfilePage",
    undefined
  >;

  route: RouteProp<RootStackParamList, "ProfilePage">;
};

export default function ProfilePage({ navigation, route }: Props) {
  const { nick, rank } = route.params;

  let component = ended_games.slice(0, 5).map((game) => {
    return (
      <EndedGame
        nick={game.playerNick}
        date={game.date}
        rank={game.rank}
        navigation={navigation}
      />
    );
  });

  let playing = false;
  let active = false;

  const goToFriendsMenu = () => {
    console.log(nick);
    navigation.navigate("PlayWithFriendsMenu", {
      nick,
      rank,
      playing,
      active,
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.profile}>
          <Profile nick={nick} rank={rank} active={active} playing={playing} />
        </View>

        <View style={styles.invite}>
          <BaseButton
            handlePress={() => {
              console.log("inv");
            }}
            text="Send Invitation"
          />
        </View>
        <View style={styles.invite}>
          <BaseButton
            handlePress={() => {
              goToFriendsMenu();
            }}
            text="Play Game"
          />
        </View>
        <Heading
          text={"Friends"}
          navigation={navigation}
          stringNavigation={"Socials"}
        />
        <FriendsIconList navigation={navigation} />
        <Heading
          text={"Old Games"}
          navigation={navigation}
          stringNavigation={"LastGame"}
        />
        {component}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profile: {
    width: "90%",
  },
  container: {
    alignItems: "center",
  },
  invite: {
    width: "90%",
    height: 55,
    margin: 3,
  },
});
