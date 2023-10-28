import { View, StyleSheet, ScrollView } from "react-native";
import React, { useReducer } from "react";
import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../Routing";
import PlayOnlineBoard from "../features/playOnline/components/Board";
import GameRecord from "../features/playOnline/components/GameRecord";
import { ColorsPallet } from "../utils/Constants";
import { sampleMoves } from "../chess-logic/ChessConstants";
import { StringMoveToText } from "../utils/ChessConvertionFunctions";
import {
  reducer,
  initialState,
} from "../features/playOnline/reducers/PlayOnlineReducer";
import GameRecordMove from "../features/playOnline/components/GameRecordMove";
import { moveToChessNotation } from "../chess-logic/convertion";
import Board from "../features/playOnline/components/Board";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "AnalyzeGame",
    undefined
  >;
  route: RouteProp<RootStackParamList, "AnalyzeGame">;
};

export default function AnalyzeGame({ navigation }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const movesContent = state.board.moves.map((move, index) => {
    return (
      <GameRecordMove
        move={moveToChessNotation(state.board, move)}
        key={index}
        handlePress={() => {
          dispatch({ type: "setCurrentPosition", payload: index });
        }}
        currentPosition={state.currentPosition}
        id={index}
      />
    );
  });
  return (
    <View style={styles.appContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.gameRecordContainer}>
          <GameRecord state={state} dispatch={dispatch} />
        </View>
        <View style={styles.mainContentContainer}>
          <View style={styles.boardContainer}>
            <Board state={state} dispatch={dispatch} rotateBoard={false} ableToMove={false}/>
          </View>
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ alignItems: "center" }}
        >
          <View style={styles.analyzisContainer}>{movesContent}</View>
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
