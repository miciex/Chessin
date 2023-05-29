import { View, StyleSheet, ScrollView } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../Routing";
import ChessBoard from "../components/ChessBoard";
import { FieldInfo, getInitialChessBoard } from "../features/playOnline";
import { ColorsPallet } from "../utils/Constants";
import { sampleMoves } from "../utils/chess-calculations/ChessConstants";
import { StringMoveToText } from "../utils/ChessConvertionFunctions";
import PiecesBar from "../features/free-board/components/PiecesBar";
import FunctionsBar from "../features/free-board/components/FunctionsBar";
import Board from "../utils/chess-calculations/board";
import { User } from "../utils/PlayerUtilities";
import { getValueFor } from "../utils/AsyncStoreFunctions";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "FreeBoard",
    undefined
  >;
  route: RouteProp<RootStackParamList, "FreeBoard">;
};

const initialChessBoard: Board = getInitialChessBoard();

export default function FreeBoard({ navigation, route }: Props) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    getValueFor("user").then((user) => {
      if (user === null) return;
      setUser(JSON.parse(user));
    });
  }, []);

  const [chessBoard, setChessBoard] = useState<Board>(initialChessBoard);
  const [whoseTurn, setWhoseTurn] = useState<"white" | "black" | null>(null);

  const analyzisContent = sampleMoves.map((move, index) => (
    <StringMoveToText move={move} key={index} />
  ));

  return (
    <View style={styles.appContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.mainContentContainer}>
          <PiecesBar barColor="white" />
          <View style={styles.boardContainer}>
            <ChessBoard board={chessBoard} setBoard={setChessBoard} />
          </View>
          <PiecesBar barColor="black" />
          <FunctionsBar />
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
    gap: 16,
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
