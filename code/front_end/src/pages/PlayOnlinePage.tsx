import { View, Text, StyleSheet, Modal, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../Routing";
import ChessBoard from "../features/playOnline/components/ChessBoard";
import PlayerBar from "../features/playOnline/components/PlayerBar";
import { getInitialChessBoard } from "../features/playOnline";
import GameRecord from "../features/playOnline/components/GameRecord";
import { ColorsPallet } from "../utils/Constants";
import { sampleMoves } from "../chess-logic/ChessConstants";
import { FontAwesome } from "@expo/vector-icons";
import SettingsGameModal from "../features/gameMenuPage/components/SettingsGameModal";
import { Board, boardFactory } from "../chess-logic/board";
import { getUser, setUserDataFromResponse } from "../services/userServices";
import { Player, responseUserToPlayer } from "../utils/PlayerUtilities";
import { getValueFor } from "../utils/AsyncStoreFunctions";
import {
  searchForGame,
  setPendingGameRequest,
} from "../features/playOnline/services/playOnlineService";
import {
  PendingChessGameRequest,
  ChessGameResponse,
} from "../utils/ServicesTypes";
import { User, userToPlayer } from "../utils/PlayerUtilities";
import { responseUserToUser } from "../utils/PlayerUtilities";
import AnalyzeGamePage from "./AnalyzeGamePage";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "PlayOnline",
    undefined
  >;
  route: RouteProp<RootStackParamList, "PlayOnline">;
};

const getBaseOpponent = (isOpponentWhite: boolean): Player => ({
  firstname: "Maciej",
  lastname: "Kowalski",
  email: "maciej@gmail.com",
  nameInGame: "miciex",
  country: "Poland",
  highestRanking: 1500,
  ranking: {
    blitz: 1500,
    rapid: 1500,
    bullet: 1500,
    classical: 1500,
  },
  color: isOpponentWhite ? "white" : "black",
});

export default function PlayOnline({ navigation, route }: Props) {
  const { request } = route.params;

  const [opponent, setOpponent] = useState<Player | null>(null);
  const [myPlayer, setMyPlayer] = useState<Player | null>(null);
  const [opponentClockInfo, setOpponentClockInfo] = useState<Date>();
  const [myClockInfo, setMyClockInfo] = useState<Date>();

  const [gearModal, setGearModal] = useState(false);
  //TODO: write reducer for boardState
  const [boardState, setBoardState] = useState<Board>(getInitialChessBoard());
  const [opacityGear, setOpacityGear] = useState(1);
  const [foundGame, setFoundGame] = useState(false);
  const [gameId, setGameId] = useState<number>(-1);

  useEffect(() => {
    getValueFor("user")
      .then((user) => {
        if (user === null) return;
        return JSON.parse(user);
      })
      .then((user: User) => {
        setMyPlayer(userToPlayer(user, null));
        searchForGame(request)
          .then((data: ChessGameResponse) => {
            setUpGame(data, user);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const toggleGear = () => {
    setGearModal(!gearModal);
  };

  const setUpGame = (data: ChessGameResponse, user: User) => {
    if (data === null) return;
    setFoundGame(true);
    setGameId(data.id);
    if (data.whiteUser.nameInGame === user.nameInGame) {
      setOpponent(responseUserToPlayer(data.blackUser, "black"));
      setMyPlayer({ ...user, color: "white" });
    } else if (data.blackUser.nameInGame === user.nameInGame) {
      setOpponent(responseUserToPlayer(data.whiteUser, "white"));
      setMyPlayer({ ...user, color: "black" });
    }

    setMyClockInfo(new Date(data.timeControl * 1000));
    setOpponentClockInfo(new Date(data.timeControl * 1000));

    setBoardState(
      boardFactory({
        fenString: data.startBoard,
        whiteToMove: data.whiteStarts,
      })
    );
  };

  console.log("myPlayer", myPlayer);

  return myPlayer !== null && foundGame === true ? (
    <View style={styles.appContainer}>
      {gearModal ? (
        <>
          <SettingsGameModal toggleGear={toggleGear} gearModalOn={gearModal} />
        </>
      ) : null}
      <View style={[styles.contentContainer, { opacity: opacityGear }]}>
        <View style={styles.gameRecordContainer}>
          <GameRecord moves={sampleMoves} />
        </View>
        <View style={styles.mainContentContainer}>
          <View style={styles.playerBarContainer}>
            <PlayerBar
              player={myPlayer.color === "black" ? myPlayer : opponent}
              timerInfo={
                myPlayer.color === "black" ? myClockInfo : opponentClockInfo
              }
            />
          </View>
          <View style={styles.boardContainer}>
            <ChessBoard
              board={boardState}
              setBoard={setBoardState}
              player={myPlayer}
              gameId={gameId}
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
              player={myPlayer.color === "white" ? myPlayer : opponent}
              timerInfo={
                myPlayer.color === "white" ? opponentClockInfo : myClockInfo
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
