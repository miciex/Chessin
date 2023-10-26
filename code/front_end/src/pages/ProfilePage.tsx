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
import {
  addFriendFunc,
  getFriendsList,
} from "../services/userServices";
import { ColorsPallet } from "../utils/Constants";
import { User, responseUserToUser } from "../utils/PlayerUtilities";
import { getValueFor } from "../utils/AsyncStoreFunctions";
import { fetchUser } from "../services/userServices";
import LogoutButton from "../components/LogoutButton";

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
  setUserNotAuthenticated: ()=>void;
};

export default function ProfilePage({ navigation, route, setUserNotAuthenticated }: Props) {
  const [user, setUser] = useState<User>({
    firstname: "",
    lastname: "",
    email: "",
    nameInGame: "",
    country: "",
    ranking: { CLASSICAL: 0, BLITZ: 0, BULLET: 0, RAPID: 0 },
    highestRanking: 0,
  });
  const [user2, setUser2] = useState<User>();
  const [ifMyAccount, setIfMyAccount] = useState<boolean>();

  const nameInGame = route?.params?.nameInGame;
  const goToFriendsMenu = () => {
    navigation.navigate("Friends", {
      nameInGame: user2?.nameInGame ? user2?.nameInGame : user?.nameInGame,
    });
  };

  useEffect(() => {
    getValueFor("user")
      .then((data) => {
        console.log("get value for user data: " + data);
        if (data === null) return;
        setUser(JSON.parse(data));
      })
      .catch((err) => {
        throw new Error(err);
      });
  }, []);

  useEffect(() => {
    if (user.nameInGame == nameInGame || nameInGame === undefined) {
      setIfMyAccount(true);
      setUser2(undefined);
    } else {
      setIfMyAccount(false);
    }
    if (
      !(user.nameInGame == nameInGame || nameInGame === undefined) &&
      nameInGame
    ) {
      fetchUser(nameInGame)
        .then((user) => {
          if (user === null) {
            return;
          }
          console.log("changing the value of user: " + user);
          setUser2(user);
        })
        .catch((err) => {
          console.log("failed to fetch user");
          throw new Error(err);
        });
    }
  }, [nameInGame, user]);

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

  const playWithFriend = () => {
    navigation.navigate("PlayWithFriendsMenu", {
      userArg: user2 ? user2 : user,
    });
  };

  const toOldGames = () => {
    navigation.navigate("LastGame");
  };

  const handleAddFriend = () => {
    addFriendFunc({ friendNickname: user2 ? user2.nameInGame : "" })
      .then((data) => {})
      .catch((err) => {
        throw new Error(err);
      });
  };

  const [friends, setFriends] = useState<Array<User>>([]);

  const checkNicknameInObjects = (
    mainObject: Array<User>,
    targetNickname: string
  ) => {
    return mainObject.some((obj) => obj.nameInGame === targetNickname);
  };

  useEffect(() => {
    if (nameInGame)
      getFriendsList(nameInGame).then((data) => {
        if (data === undefined) return;
        setFriends(data.map((x) => responseUserToUser(x, "")));
      });
  }, [nameInGame, user?.nameInGame]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.profile}>
          <Profile
            nick={user2 ? user2.nameInGame : user.nameInGame}
            rank={user2 ? user2.ranking : user.ranking}
            active={user2 ? user2.online : user.online}
            playing={user2 ? user2.playing : user.playing}
            country={user2 ? user2.country : user.country}
          />
        </View>

        {ifMyAccount ||
        checkNicknameInObjects(
          friends,
          user?.nameInGame ? user?.nameInGame : ""
        ) ? (
          <LogoutButton navigation={navigation} setUserNotAuthenticated={setUserNotAuthenticated}/>
        ) : (
          <View style={styles.invite}>
            <BaseButton
              handlePress={() => {
                handleAddFriend;
              }}
              text="Send Invitation"
            />
          </View>
        )}

        {ifMyAccount ? (
          ""
        ) : (
          <View style={styles.invite}>
            <BaseButton
              handlePress={() => {
                playWithFriend();
              }}
              text="Play Game"
            />
          </View>
        )}
        <Heading
          text={"Friends"}
          navigation={navigation}
          stringNavigation={goToFriendsMenu}
        />
        <FriendsIconList
          navigation={navigation}
          nameInGame={user2 ? user2.nameInGame : user.nameInGame}
        />
        <Heading
          text={"Old Games"}
          navigation={navigation}
          stringNavigation={toOldGames}
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
