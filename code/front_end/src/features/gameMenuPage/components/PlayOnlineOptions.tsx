import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import TimeOptionsModal from "./TimeOptionsModal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../Routing";
import ChooseTimeButton from "./ChooseTimeButton";
import ChooseFriendsToPlayWith from "./ChooseFriendsToPlayWith";
import { User } from "../../../utils/PlayerUtilities";
import { LengthType } from "../context/GameLengthContext";
import { chosenFriendContext } from "../context/ChosenFriendContext";
import BaseButton from "../../../components/BaseButton";
import { setPendingGameRequest } from "../../playOnline/services/playOnlineService";
import { getRanking } from "../../../utils/PlayerUtilities";
import { GameType } from "../../../chess-logic/board";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "GameMenu",
    undefined
  >;
  user: User | null;
};

const friends: Array<User> = [
  {
    firstname: "Maciek",
    lastname: "mil",
    nameInGame: "hello",
    email: "maciej@gmail.com",
    country: "Poland",
    ranking: { BLITZ: 1500, BULLET: 1500, RAPID: 1500, CLASSICAL: 1500 },
    highestRanking: 1500,
    online: true,
  },
  {
    firstname: "Wojtek",
    lastname: "Burek",
    email: "wojtek@gmail.com",
    country: "pl",
    ranking: { BLITZ: 1500, BULLET: 1500, RAPID: 1500, CLASSICAL: 1500 },
    highestRanking: 1500,
    online: true,
    nameInGame: "wojtek",
  },
  {
    firstname: "Sławek",
    lastname: "Dąbrowski",
    nameInGame: "lelo",
    email: "sławek@gmail.com",
    country: "pl",
    ranking: { BLITZ: 1500, BULLET: 1500, RAPID: 1500, CLASSICAL: 1500 },
    highestRanking: 1500,
    online: true,
  },
  {
    firstname: "Paweł",
    email: "paweł@gmail.com",
    country: "pl",
    ranking: { BLITZ: 1500, BULLET: 1500, RAPID: 1500, CLASSICAL: 1500 },
    highestRanking: 1500,
    online: true,
    nameInGame: "pawel",
    lastname: "Brzuszkiewicz",
  },
  {
    firstname: "Szymon",
    email: "szymon@gmail.com",
    country: "pl",
    ranking: { BLITZ: 1500, BULLET: 1500, RAPID: 1500, CLASSICAL: 1500 },
    highestRanking: 1500,
    online: true,
    nameInGame: "szymon",
    lastname: "Kowalski",
  },
  {
    firstname: "Strzała",
    email: "strzała@gmail.com",
    country: "pl",
    ranking: { BLITZ: 1500, BULLET: 1500, RAPID: 1500, CLASSICAL: 1500 },
    highestRanking: 1500,
    online: true,
    nameInGame: "strzała",
    lastname: "Kowalski",
  },
];

export default function PlayOnlineOptions({ navigation, user }: Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [gameTempo, setGameTempo] = useState<LengthType>({
    gameType: GameType.BLITZ,
    totalTime: 3 * 60 * 1000,
    increment: 0,
  });
  const [chosenFriend, setChosenFriend] = useState<User | null>(null);

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
    console.log("user: ", user);
    if (!user) return;
    console.log("navigating");
    navigation.navigate("PlayOnline", {
      request: setPendingGameRequest(
        gameTempo.totalTime,
        gameTempo.increment,
        getRanking(gameTempo.gameType, user),
        user.nameInGame,
        gameTempo.gameType
      ),
    });
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
