import { View, StyleSheet } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../Routing";
import ChessBoard from "../components/ChessBoard";
import PlayerBar from "../features/playOnline/components/PlayerBar";
import { User, UserContext } from "../context/UserContext";
import {
  Move,
  FieldInfo,
  Player,
  getInitialChessBoard,
} from "../features/playOnline";
import GameRecord from "../features/playOnline/components/GameRecord";
import { ColorsPallet } from "../utils/Constants";
import { sampleMoves } from "../utils/chess-calculations/ChessConstants";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "PlayOnline",
    undefined
  >;
  route: RouteProp<RootStackParamList, "PlayOnline">;
};

const initialChessBoard: FieldInfo[] = getInitialChessBoard();

export default function PlayOnline({ navigation, route }: Props) {
  const user = useContext(UserContext);

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
    setMyPlayer({ user: user, color: isOpponentWhite ? "black" : "white" });
  }, []);

  const [gameRecord, setGameRecord] = useState<Move[]>([]);
  const [chessBoard, setChessBoard] =
    useState<Array<FieldInfo>>(initialChessBoard);
  const [opponent, setOpponent] = useState<Player | null>(null);
  const [myPlayer, setMyPlayer] = useState<Player | null>(null);
  const [isMyTurn, setIsMyTurn] = useState<boolean>(false);
  const [opponentClockInfo, setOpponentClockInfo] = useState<
    Date | undefined
  >();
  const [myClockInfo, setMyClockInfo] = useState<Date>();
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  return (
    <View style={styles.appContainer}>
      <View style={styles.contentContainer}>
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
            <ChessBoard board={chessBoard} />
          </View>
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
