import { View, StyleSheet, Text } from "react-native";
import React, { useState } from "react";
import TimeOptionsModal from "./TimeOptionsModal";
import StartGameButton from "../../../components/StartGameButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../Routing";
import { ColorsPallet } from "../../../utils/Constants";
import ChooseTimeButton from "./ChooseTimeButton";
import ChooseFriendsToPlayWith from "./ChooseFriendsToPlayWith";
import { User } from "../../../context/UserContext";
import {
  LengthType,
  GameLengthTypeContextType,
} from "../context/GameLengthContext";
import { chosenFriendContext } from "../context/ChosenFriendContext";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "GameMenu",
    undefined
  >;
};

const friends: Array<User> = [
  { name: "Maciek", email: "maciej@gmail.com", country: "pl", ranking: 1500 },
  { name: "Wojtek", email: "wojtek@gmail.com", country: "pl", ranking: 1500 },
  { name: "Sławek", email: "sławek@gmail.com", country: "pl", ranking: 1500 },
  { name: "Paweł", email: "paweł@gmail.com", country: "pl", ranking: 1500 },
  { name: "Szymon", email: "szymon@gmail.com", country: "pl", ranking: 1500 },
  { name: "Strzała", email: "strzała@gmail.com", country: "pl", ranking: 1500 },
];

export default function PlayOnlineOptions({ navigation }: Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [gameTempo, setGameTempo] = useState<LengthType>({
    lengthType: GameLengthTypeContextType.BLITZ,
    totalTime: 180,
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
                <StartGameButton
                  navigation={navigation}
                  navigationRoute="PlayOnline"
                />
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
