import { View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import TimeOptionsModal from "./TimeOptionsModal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../Routing";
import ChooseTimeButton from "./ChooseTimeButton";
import ChooseFriendsToPlayWith from "./ChooseFriendsToPlayWith";
import {
  ResponseUser,
  User,
  responseUserToUser,
} from "../../../utils/PlayerUtilities";
import { LengthType } from "../context/GameLengthContext";
import { chosenFriendContext } from "../context/ChosenFriendContext";
import BaseButton from "../../../components/BaseButton";
import { setPendingGameRequest } from "../../playOnline/services/playOnlineService";
import { getRanking } from "../../../utils/PlayerUtilities";
import { GameType } from "../../../chess-logic/board";
import {
  getFriendsList,
  getPagedFriends,
} from "../../../services/userServices";
import { getValueFor } from "../../../utils/AsyncStoreFunctions";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "GameMenu",
    undefined
  >;
  user: User | null;
};

export default function PlayOnlineOptions({ navigation, user }: Props) {
  const [myUser, setMyUser] = useState<User | null>(user);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [gameTempo, setGameTempo] = useState<LengthType>({
    gameType: GameType.BLITZ,
    totalTime: 3 * 60 * 1000,
    increment: 0,
  });
  const [friends, setFriends] = useState<User[]>([]);
  const [chosenFriend, setChosenFriend] = useState<User | null>(null);

  useEffect(() => {
    if (user) return;
    getValueFor("user")
      .then((data: string | null) => {
        if (!data) {
          return navigation.navigate("Home");
        }
        setMyUser(JSON.parse(data));
      })
      .catch(() => {
        throw new Error("Error while getting user");
      });
  }, []);

  useEffect(() => {
    if (!myUser) return;
    getPagedFriends(myUser.nameInGame, 0)
      .then((data: null | ResponseUser[]) => {
        if (!data) return;
        setFriends(data.map((x) => responseUserToUser(x, "")));
      })
      .catch(() => {
        throw new Error("Error while getting friends");
      });
  }, [myUser]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleGameTempoChange = (tempo: LengthType) => {
    setGameTempo(tempo);
  };

  const handleChooseFriend = (friend: User) => {
    setChosenFriend((prevFriend) =>
      prevFriend?.email === friend.email ? null : friend
    );
  };

  const handlePlayOnline = () => {
    if (!myUser) return;
    if (chosenFriend === null) {
      return navigation.navigate("PlayOnline", {
        request: setPendingGameRequest(
          gameTempo.totalTime,
          gameTempo.increment,
          getRanking(gameTempo.gameType, myUser),
          myUser.nameInGame,
          gameTempo.gameType
        ),
      });
    }
    navigation.navigate("PlayWithFriendsMenu", { userArg: chosenFriend });
  };

  return (
    <chosenFriendContext.Provider value={chosenFriend}>
      <View style={styles.container}>
        {isModalOpen ? (
          <TimeOptionsModal
            handleCloseModal={handleCloseModal}
            handleGameTempoChange={handleGameTempoChange}
          />
        ) : (
          <View>
            <ChooseTimeButton
              handleOpenModal={handleOpenModal}
              tempo={gameTempo}
            />
            <View style={styles.chooseFriendContainer}>
              <ChooseFriendsToPlayWith
                friends={friends}
                handleChooseFriend={handleChooseFriend}
              />
            </View>
            <View style={styles.startGameButtonOuterContainer}>
              <View style={styles.startGameButtonInnerContainer}>
                <BaseButton handlePress={handlePlayOnline} text="Play" />
              </View>
            </View>
          </View>
        )}
      </View>
    </chosenFriendContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    gap: 16,
  },
  openModalButtonContainer: {
    flex: 1,
  },
  startGameButtonInnerContainer: {
    width: "80%",
    height: 32,
  },
  startGameButtonOuterContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  chooseFriendContainer: {
    flex: 5,
    width: "100%",
    maxWidth: "100%",
  },
});
