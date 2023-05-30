import { View, StyleSheet } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../Routing";
import ChessBoard from "../components/ChessBoard";
import PlayerBar from "../features/playOnline/components/PlayerBar";
import { FieldInfo, getInitialChessBoard } from "../features/playOnline";
import GameRecord from "../features/playOnline/components/GameRecord";
import { ColorsPallet } from "../utils/Constants";
import { sampleMoves } from "../utils/chess-calculations/ChessConstants";
import { FontAwesome5 } from "@expo/vector-icons";
import { BotPlayer } from "../features/playOnline";
import BotBar from "../features/play-with-bot/components/BotBar";
import { Board } from "../chess-logic/board";
import { Player } from "../utils/PlayerUtilities";
import { getUser } from "../services/userServices";
import { getValueFor } from "../utils/AsyncStoreFunctions";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "PlayBot",
    undefined
  >;
  route: RouteProp<RootStackParamList, "PlayBot">;
};

const initialChessBoard: Board = getInitialChessBoard();

export default function PlayBot({ navigation, route }: Props) {
  // const [gameRecord, setGameRecord] = useState<Move[]>([]);
  const [chessBoard, setChessBoard] = useState<Board>(initialChessBoard);
  const [opponent, setOpponent] = useState<BotPlayer | null>(null);
  const [myPlayer, setMyPlayer] = useState<Player | null>(null);
  const [isMyTurn, setIsMyTurn] = useState<boolean>(true);
  const [opponentClockInfo, setOpponentClockInfo] = useState<
    Date | undefined
  >();
  const [myClockInfo, setMyClockInfo] = useState<Date>();
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);
  useEffect(() => {
    const isOpponentWhite = Math.random() > 0.5;
    setOpponent({
      user: {
        name: "Stockfish",
        iconName: "fish",
        ranking: 1500,
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

  return (
    <View style={styles.appContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.gameRecordContainer}>
          <GameRecord moves={sampleMoves} />
        </View>
        <View style={styles.mainContentContainer}>
          <View style={styles.playerBarContainer}>
            {opponent?.color === "black" ? (
              <BotBar player={opponent} />
            ) : (
              <PlayerBar player={myPlayer} />
            )}
          </View>
          <View style={styles.boardContainer}>
            <ChessBoard board={chessBoard} setBoard={setChessBoard} />
          </View>
          <View style={styles.playerBarContainer}>
            {opponent?.color !== "black" ? (
              <BotBar player={opponent} />
            ) : (
              <PlayerBar player={myPlayer} />
            )}
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
