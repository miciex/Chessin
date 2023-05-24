import { View, Text, StyleSheet, Modal, Pressable } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../Routing";
import ChessBoard from "../components/ChessBoard";
import PlayerBar from "../features/playOnline/components/PlayerBar";
import { User, UserContext } from "../context/UserContext";
import {
  FieldInfo,
  Player,
  getInitialChessBoard,
} from "../features/playOnline";
import GameRecord from "../features/playOnline/components/GameRecord";
import { ColorsPallet } from "../utils/Constants";
import {
  sampleMoves,
  StartingPositions,
} from "../utils/chess-calculations/ChessConstants";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import SettingsGameModal from "../features/gameMenuPage/components/SettingsGameModal";
import Board from "../utils/chess-calculations/board";
import { Move } from "../utils/chess-calculations/move";
import { getUser } from "../services/userServices";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "PlayOnline",
    undefined
  >;
  route: RouteProp<RootStackParamList, "PlayOnline">;
};

export default function PlayOnline({ navigation, route }: Props) {
  const user = useContext(UserContext);
  const [opponent, setOpponent] = useState<Player | null>(null);
  const [myPlayer, setMyPlayer] = useState<Player | null>(null);
  const [opponentClockInfo, setOpponentClockInfo] = useState<
    Date | undefined
  >();
  const [myClockInfo, setMyClockInfo] = useState<Date>();
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  const [gearModal, setGearModal] = useState(false);
  //TODO: write reducer for boardState
  const [boardState, setBoardState] = useState<Board>(getInitialChessBoard());
  const [opacityGear, setOpacityGear] = useState(1);

  //TODO: get opponent from server and user from react-native-storage
  useEffect(() => {
    const isOpponentWhite = Math.random() > 0.5;
    setOpponent({
      user: {
        name: "Maciej",
        email: "maciej@gmail.com",
        country: "pl",
        ranking: 1500,
      },
      color: isOpponentWhite ? "white" : "black",
    });

    getUser().then((user) => {
      if (user === null) return;
      setMyPlayer({ user: user, color: isOpponentWhite ? "black" : "white" });
    });
  }, []);

  const toggleGear = () => {
    setGearModal(!gearModal);
  };

  return (
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
            <ChessBoard board={boardState} setBoard={setBoardState} />
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
  );
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
