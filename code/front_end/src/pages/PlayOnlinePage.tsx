import { View, Text, StyleSheet, Modal, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../Routing";
import ChessBoard from "../components/ChessBoard";
import PlayerBar from "../features/playOnline/components/PlayerBar";
import { getInitialChessBoard } from "../features/playOnline";
import GameRecord from "../features/playOnline/components/GameRecord";
import { ColorsPallet } from "../utils/Constants";
import { sampleMoves } from "../utils/chess-calculations/ChessConstants";
import { FontAwesome } from "@expo/vector-icons";
import SettingsGameModal from "../features/gameMenuPage/components/SettingsGameModal";
import { Board } from "../utils/chess-calculations/board";
import { getUser } from "../services/userServices";
import { Player } from "../utils/PlayerUtilities";
import { getValueFor } from "../utils/AsyncStoreFunctions";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "PlayOnline",
    undefined
  >;
  route: RouteProp<RootStackParamList, "PlayOnline">;
};

export default function PlayOnline({ navigation, route }: Props) {
  const [opponent, setOpponent] = useState<Player | null>(null);
  const [myPlayer, setMyPlayer] = useState<Player | null>(null);
  const [opponentClockInfo, setOpponentClockInfo] = useState<Date>();
  const [myClockInfo, setMyClockInfo] = useState<Date>();

  const [gearModal, setGearModal] = useState(false);
  //TODO: write reducer for boardState
  const [boardState, setBoardState] = useState<Board>(getInitialChessBoard());
  const [opacityGear, setOpacityGear] = useState(1);

  //TODO: get opponent from server and user from react-native-storage
  useEffect(() => {
    const isOpponentWhite = false; //Math.random() > 0.5;
    setOpponent({
      user: {
        firstName: "Maciej",
        lastName: "Kowalski",
        email: "maciej@gmail.com",
        nameInGame: "miciex",
        country: "pl",
        highestRanking: 1500,
        ranking: {
          blitz: 1500,
          rapid: 1500,
          bullet: 1500,
          classical: 1500,
        },
      },
      color: isOpponentWhite ? "white" : "black",
    });

    getValueFor("user").then((user) => {
      if (user === null) return;
      setMyPlayer({
        user: JSON.parse(user),
        color: isOpponentWhite ? "black" : "white",
      });
    });
  }, []);

  const toggleGear = () => {
    setGearModal(!gearModal);
  };

  return myPlayer !== null ? (
    <View style={styles.appContainer}>
      {gearModal ? (
        <>
          <SettingsGameModal toggleGear={toggleGear} gearModalOn={gearModal} />
          {}
        </>
      ) : null}
      <View style={[styles.contentContainer, { opacity: opacityGear }]}>
        <View style={styles.gameRecordContainer}>
          <GameRecord moves={sampleMoves} />
        </View>
        <View style={styles.mainContentContainer}>
          <View style={styles.playerBarContainer}>
            <PlayerBar
              player={opponent?.color === "black" ? opponent : myPlayer}
              timerInfo={
                opponent?.color === "black" ? opponentClockInfo : myClockInfo
              }
            />
          </View>
          <View style={styles.boardContainer}>
            <ChessBoard
              board={boardState}
              setBoard={setBoardState}
              myPlayer={myPlayer}
            />
          </View>
          <Text>
            <FontAwesome
              name="gear"
              size={34}
              color="black"
              onPress={toggleGear}
            />
          </Text>
          <View style={styles.playerBarContainer}>
            <PlayerBar
              player={opponent?.color !== "black" ? opponent : myPlayer}
              timerInfo={
                opponent?.color === "black" ? opponentClockInfo : myClockInfo
              }
            />
          </View>
        </View>
      </View>
      <Footer navigation={navigation} />
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignContent: "stretch",
    backgroundColor: ColorsPallet.lighter,
    alignItems: "center",
  },
  contentContainer: {
    flex: 8,
    alignItems: "center",
    gap: 16,
  },
  boardContainer: {
    width: "90%",
    aspectRatio: 1,
  },
  playerBarContainer: {
    width: "90%",
    height: 50,
  },
  gameRecordContainer: {
    width: "100%",
    height: 32,
  },
  mainContentContainer: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    gap: 16,
    justifyContent: "space-evenly",
  },
});
