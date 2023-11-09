import { View, StyleSheet, ScrollView, Text } from "react-native";
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
  checkInvitations,
  checkSendedInvitations,
  getFriendsList,
  getPagedGames,
  getUser,
  handleFriendInvitationFunc,
} from "../services/userServices";
import { ColorsPallet } from "../utils/Constants";
import { User, responseUserToUser } from "../utils/PlayerUtilities";
import { getValueFor } from "../utils/AsyncStoreFunctions";
import { fetchUser } from "../services/userServices";
import { FriendInvitationResponseType } from "../utils/ServicesTypes";
import LogoutButton from "../components/LogoutButton";
import { getGameHistory } from "../services/chessGameService";
import { ChessGameResponse } from "../utils/ServicesTypes";
import { BounceOutDown } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { AnimatedScrollView } from "react-native-reanimated/lib/typescript/reanimated2/component/ScrollView";


type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "ProfilePage",
    undefined
  >;

  route: RouteProp<RootStackParamList, "ProfilePage">;
  setUserNotAuthenticated: () => void;
};

export default function ProfilePage({
  navigation,
  route,
  setUserNotAuthenticated,
}: Props) {
  const [user, setUser] = useState<User>();
  const [userGames, setUserGames] = useState<ChessGameResponse[]>([]);
  const [user2, setUser2] = useState<User>();
  const [ifMyAccount, setIfMyAccount] = useState<boolean>();
  const [refresh, setRefresh] = useState<boolean>(true);

  const nameInGame = route?.params?.nameInGame;
  const goToFriendsMenu = () => {
    navigation.navigate("Friends", {
      nameInGame: user2?.nameInGame
        ? user2?.nameInGame
        : user
        ? user?.nameInGame
        : "",
    });
  };

  useEffect(() => {
    getValueFor("user")
      .then((user) => {
        if (!user) return navigation.navigate("UserNotAuthenticated");
        let parsedUser: User = JSON.parse(user);
        if (!parsedUser) return navigation.navigate("UserNotAuthenticated");
        setUser(parsedUser);
        getPagedGames(parsedUser.nameInGame, 0)
          .then((data: ChessGameResponse[] | null) => {
            if (!data) return;
            setUserGames(data);
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((error) => {
        navigation.navigate("UserNotAuthenticated");
        throw new Error(error);
      });
  }, []);

  useEffect(() => {
    if (user && (user.nameInGame == nameInGame || nameInGame == "user")) {
      setIfMyAccount(true);
      setUser2(undefined);
    } else {
      setIfMyAccount(false);
    }
    if (nameInGame != "user" && nameInGame) {
      fetchUser(nameInGame)
        .then((user) => {
          if (user === null) {
            return;
          }
          setUser2(user);
          checkSendedInvitations().then((data) => {
            if (data === undefined) return;
            setSendedInvitations(data.map((x) => responseUserToUser(x, "")));
          }).catch((err) => {
            throw new Error(err);
          });
        })
        .catch((err) => {
          console.error("failed to fetch user");
          throw new Error(err);
        });
    }
  }, [nameInGame, user, refresh]);

  let component;

  component =
    userGames.length > 0 ? (
      userGames.slice(0, 5).map((game) => (
        // <View style={{ width: "90%" }}>
          <EndedGame
            nick={
              game.whiteUser.nameInGame === user?.nameInGame
                ? game.blackUser.nameInGame
                : game.whiteUser.nameInGame
            }
            rank={
              game.whiteUser.nameInGame === user?.nameInGame
                ? game.blackRating
                : game.whiteRating
            }
            result={game.gameResult}
            navigation={navigation}
            key={`${game.id}${user?.nameInGame}`}
            date={new Date(game.startTime)}
            gameId={game.id}
            myPlayerWhite={game.whiteUser.nameInGame === user?.nameInGame}
            whiteToMove={
              (game.whiteStarts && game.moves.length % 2 === 0) ||
              (game.moves.length % 2 === 1 && !game.whiteStarts)
            }
          />
        // </View>
      ))
    ) : (
      <View style={{ padding: 40 }}>
        <Text
          style={{
            color: ColorsPallet.baseColor,
            fontSize: 20,
            textAlign: "center",
          }}
        >
          No Old Games Yet
        </Text>
      </View>
    );

  const playWithFriend = () => {
    let userArg: User;
    if (user2) userArg = user2;
    else if (user) userArg = user;
    else return;
    navigation.navigate("PlayWithFriendsMenu", {
      userArg: userArg,
    });
  };

  const toOldGames = () => {
    navigation.navigate("LastGame");
  };

  const handleAddFriend = () => {
    addFriendFunc({ friendNickname: user2 ? user2.nameInGame : "" })
      .catch((err) => {
        throw new Error(err);
      });
    setRefresh(!refresh);
  };

  const [friends, setFriends] = useState<Array<User>>([]);
  const [sendedInvitations, setSendedInvitations] = useState<Array<User>>([]);
  const [invitations, setInvitations] = useState<Array<User>>([]);

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
      }).catch((err) => {
        throw new Error(err);
      });

    checkInvitations().then((data) =>{ 
      if(data === undefined) return
      setInvitations(data.map(x => responseUserToUser(x.user, "")))
    }).catch(err => {
      throw new Error(err)
    })
     
  }, [nameInGame, user?.nameInGame])

  useEffect(() => {
    if (nameInGame)
      getFriendsList(nameInGame).then((data) => {
        if (data === undefined) return;
        setFriends(data.map((x) => responseUserToUser(x, "")));
      }).catch((err) => {
        throw new Error(err);
      });
  }, [nameInGame, user?.nameInGame]);

  return (
    <ScrollView style={{ backgroundColor: ColorsPallet.light }}>
      <View style={styles.container}>
      {/* <Animated.View style={styles.container}> */}
        <View style={styles.profile}>
          <Profile
            nick={user2 ? user2.nameInGame : user ? user.nameInGame : ""}
            rank={user2 ? user2.ranking : user ? user.ranking : undefined}
            active={user2 ? user2.online : user ? user.online : false}
            playing={user2 ? user2.playing : user ? user.playing : false}
            country={user2 ? user2.country : user ? user.country : ""}
          />
        </View>

        {ifMyAccount ||
        checkNicknameInObjects(
          friends,
          user?.nameInGame ? user?.nameInGame : ""
        ) ? (
          ""
        ) : checkNicknameInObjects(
            sendedInvitations,
            user2?.nameInGame ? user2?.nameInGame : ""
          ) ? (
          <View style={styles.invite}>
            <View style={styles.sent}>
              <Text style={{ fontSize: 16 }}>Invitation Sent</Text>
            </View>
          </View>
        ) : user2 && checkNicknameInObjects(invitations, user2.nameInGame) ? (
          <View style={styles.invite}>
            <BaseButton
              handlePress={() => {
                handleFriendInvitationFunc({
                  friendNickname: user2.nameInGame,
                  responseType: FriendInvitationResponseType.ACCEPT,
                });
              }}
              text={"Accept Invitation"}
            />
          </View>
        ) : (
          <View style={styles.invite}>
            <BaseButton
              handlePress={() => {
                handleAddFriend();
              }}
              text="Send invitation"
            />
          </View>
        )}

        {ifMyAccount ? (
          <LogoutButton
            navigation={navigation}
            setUserNotAuthenticated={setUserNotAuthenticated}
          />
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
          nameInGame={user2 ? user2.nameInGame : user ? user.nameInGame : ""}
        />
        <Heading
          text={"Old Games"}
          navigation={navigation}
          stringNavigation={toOldGames}
        />
        <View style={{ width: "85%" }}>{component}</View>
      {/* </Animated.View> */}
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
  sent: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ColorsPallet.dark,
  },
});
