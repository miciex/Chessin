import { View, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useReducer } from "react";
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
} from "../features/analyzeGame/reducers/AnalyzeGameReducer";
import GameRecordMove from "../features/playOnline/components/GameRecordMove";
import { moveToChessNotation } from "../chess-logic/convertion";
import Board from "../features/analyzeGame/components/Board";
import { getGameById } from "../services/chessGameService";
import { ChessGameResponse } from "../utils/ServicesTypes";
import BaseButton from "../components/BaseButton";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "AnalyzeGame",
    undefined
  >;
  route: RouteProp<RootStackParamList, "AnalyzeGame">;
};

export default function AnalyzeGame({ navigation, route }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getGameById(String(route.params.gameId))
      .then((chessGameResponse: ChessGameResponse) => {
        dispatch({
          type: "setDataFromChessGameResponse",
          payload: chessGameResponse,
        });
      })
      .catch(() => {
        throw new Error("Something went wrong");
      });
  }, []);

  const changeCurrentPosition = (position: number) => {
    dispatch({ type: "setCurrentPosition", payload: position });
  };

  const setNextPosition = () => {
    dispatch({ type: "setNextPosition" });
  };

  const setPreviousPosition = () => {
    dispatch({ type: "setPreviousPosition" });
  };

  return (
    <View style={styles.appContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.mainContentContainer}>
          <View style={styles.boardContainer}>
            <Board
              state={state}
              dispatch={dispatch}
              rotateBoard={false}
              ableToMove={false}
            />
          </View>
        </View>
        <View style={styles.bottomPartContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={styles.analyzisContainer}>
              <GameRecord
                moves={state.moves}
                positions={state.positions}
                currentPosition={state.currentPosition-1}
                setCurrentPosition={changeCurrentPosition}
                analyzeGame={true}
              />
            </View>
          </ScrollView>
          <View style={styles.arrowButtonsContainer}>
            <View style={styles.arrowButtonContainer}>
              <BaseButton
                text=""
                element={
                  <Ionicons
                    name="arrow-back-circle-outline"
                    size={24}
                    color="black"
                  />
                }
                handlePress={setPreviousPosition}
              />
            </View>
            <View style={styles.arrowButtonContainer}>
              <BaseButton
                text=""
                element={
                  <Ionicons
                    name="arrow-forward-circle-outline"
                    size={24}
                    color="black"
                  />
                }
                handlePress={setNextPosition}
              />
            </View>
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
    gap: 4,
    backgroundColor: ColorsPallet.darker,
  },
  bottomPartContainer: {
    width: "100%",
    backgroundColor: ColorsPallet.darker,
    flex:1
  },
  arrowButtonsContainer: {
    width: "100%",
    height: 48,
    overflow: "hidden",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 8
  },
  arrowButtonContainer: {
    width: 64,
    height: "100%",
  },
  scrollView: {
    width: "100%",
  }
});
