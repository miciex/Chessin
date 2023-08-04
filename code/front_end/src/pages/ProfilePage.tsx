import { View, StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import Profile from "../features/playWithFriend/components/Profile";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import EndedGame from "../features/home/components/EndedGame";
import Heading from "../components/Heading";
import FriendsIconList from "../features/playWithFriend/components/FriendsIconList";
import BaseButton from "../components/BaseButton";
import { addFriendFunc } from "../services/userServices";
import { ColorsPallet } from "../utils/Constants";
import { User } from "../utils/PlayerUtilities";
import { getValueFor } from "../utils/AsyncStoreFunctions";
import { fetchUser } from "../services/userServices";

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
  const [user, setUser] = useState<User>();
  // const [data, loading, error] = useFetch("http://localhost:3000/user", {});

  const wojtek = fetchUser("papiezwojtyla9@gmail.com");
  useEffect(() => {
    getValueFor("user").then((user) => {
      if (user === null) return;
      setUser(JSON.parse(user));
    });
  }, []);

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
    navigation.navigate("PlayWithFriendsMenu", {});
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.profile}>
          <Profile
            nick={user ? user.nameInGame : ""}
            rank={user ? user.highestRanking : 0}
            active={active}
            playing={playing}
          />
        </View>

        <View style={styles.invite}>
          <BaseButton
            handlePress={() => {
              addFriendFunc({ friendNickname: "PabisackCox" });
              // addFriendFunc(user?  user?.nameInGame : "")
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
        <View style={{ width: "85%" }}>{component}</View>
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
    width: "100%",
    height: "100%",
    backgroundColor: ColorsPallet.light,
  },
  invite: {
    width: "90%",
    height: 55,
    margin: 3,
  },
});
