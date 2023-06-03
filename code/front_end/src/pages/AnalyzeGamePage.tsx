import { View, StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../Routing";
import PlayOnlineChessBoard from "../features/playOnline/components/PlayOnlineChessBoard";
import { getInitialChessBoard } from "../features/playOnline";
import GameRecord from "../features/playOnline/components/GameRecord";
import { ColorsPallet } from "../utils/Constants";
import { sampleMoves } from "../chess-logic/ChessConstants";
import { StringMoveToText } from "../utils/ChessConvertionFunctions";
import { Board } from "../chess-logic/board";
import { getUser } from "../services/userServices";
import { Player, User, responseUserToPlayer } from "../utils/PlayerUtilities";
import { getValueFor } from "../utils/AsyncStoreFunctions";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "AnalyzeGame",
    undefined
  >;
  route: RouteProp<RootStackParamList, "AnalyzeGame">;
};

export default function AnalyzeGame({ navigation, route }: Props) {
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    getValueFor("user").then((user) => {
      if (user === null) return;
      const player = { ...JSON.parse(user), color: "white" };
      setPlayer(player);
    });
  }, []);

  const [boardState, setBoardState] = useState<Board>(getInitialChessBoard());

  const analyzisContent = sampleMoves.map((move, index) => (
    <StringMoveToText move={move} key={index} />
  ));

  return (
    <View style={styles.appContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.gameRecordContainer}>
          <GameRecord moves={sampleMoves} />
        </View>
        <View style={styles.mainContentContainer}>
          <View style={styles.boardContainer}>
            <PlayOnlineChessBoard
              board={boardState}
              setBoard={setBoardState}
              playersColor={player?.color === "white" ? player.color : null}
            />
          </View>
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ alignItems: "center" }}
        >
          <View style={styles.analyzisContainer}>{analyzisContent}</View>
        </ScrollView>
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
    paddingTop: 32,
  },
  contentContainer: {
    flex: 8,
    alignItems: "center",
  },
  boardContainer: {
    width: "100%",
    aspectRatio: 1,
  },
  gameRecordContainer: {
    width: "100%",
    height: 32,
  },
  mainContentContainer: {
    width: "100%",
    alignItems: "center",
  },
  analyzisContainer: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "stretch",
    rowGap: 4,
  },
  scrollView: {
    width: "100%",
    backgroundColor: ColorsPallet.darker,
  },
});
