import { View, StyleSheet, ScrollView, StatusBar } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../Routing";
import ChessBoard from "../components/ChessBoard";
import { User, UserContext } from "../context/UserContext";
import {
  Move,
  FieldInfo,
  Player,
  getInitialChessBoard,
} from "../features/playOnline";
import GameRecord from "../features/playOnline/components/GameRecord";
import { ColorsPallet } from "../utils/Constants";
import { sampleMoves } from "../utils/ChessConstants";
import { FontAwesome5 } from "@expo/vector-icons";
import { StringMoveToText } from "../utils/ChessConvertionFunctions";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "AnalyzeGame",
    undefined
  >;
  route: RouteProp<RootStackParamList, "AnalyzeGame">;
};

const initialChessBoard: FieldInfo[] = getInitialChessBoard();

export default function AnalyzeGame({ navigation, route }: Props) {
  const user = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setWhoseTurn("white");
    }
  }, []);

  const [gameRecord, setGameRecord] = useState<Move[]>([]);
  const [chessBoard, setChessBoard] =
    useState<Array<FieldInfo>>(initialChessBoard);
  const [whoseTurn, setWhoseTurn] = useState<"white" | "black" | null>(null);

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
            <ChessBoard board={chessBoard} />
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
