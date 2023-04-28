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

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "GameMenu",
    undefined
  >;
};

const friends: Array<User> = [
  { name: "Maciek", email: "maciej@gmail.com" },
  { name: "Wojtek", email: "wojtek@gmail.com" },
  { name: "Sławek", email: "sławek@gmail.com" },
  { name: "Paweł", email: "paweł@gmail.com" },
  { name: "Szymon", email: "szymon@gmail.com" },
  { name: "Strzała", email: "strzała@gmail.com" },
];

export default function PlayOnlineOptions({ navigation }: Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [gameTempo, setGameTempo] = useState<LengthType>({
    lengthType: GameLengthTypeContextType.BLITZ,
    totalTime: 180,
    increment: 0,
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleGameTempoChange = (tempo: LengthType) => {
    setGameTempo(tempo);
  };

  return (
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
            <ChooseFriendsToPlayWith friends={friends} />
          </View>
          <View style={styles.startGameButtonOuterContainer}>
            <View style={styles.startGameButtonInnerContainer}>
              <StartGameButton navigation={navigation} />
            </View>
          </View>
        </View>
      )}
    </View>
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
