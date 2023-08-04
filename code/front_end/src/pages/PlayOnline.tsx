import { View, StyleSheet } from "react-native";
import React, { useState, useReducer, useEffect } from "react";
import { GameResults } from "../chess-logic/board";
import {
  Player,
  User,
  responseUserToPlayer,
  userToPlayer,
} from "../utils/PlayerUtilities";
import TestBoard from "../features/playOnline/components/Board";
import Bar from "../features/playOnline/components/Bar";
import PlayOnlineBar from "../features/playOnline/components/PlayOnlineBar";
import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import SettingsGameModal from "../features/gameMenuPage/components/SettingsGameModal";
import WaitingForGame from "../features/playOnline/components/WaitingForGame";
import GameFinishedOverlay from "../features/playOnline/components/GameFinishedOverlay";
import {
  getInitialState,
  reducer,
} from "../features/playOnline/reducers/PlayOnlineReducer";
import { getValueFor } from "../utils/AsyncStoreFunctions";
import {
  cancelSearch,
  getGameByUsername,
  listenForFirstMove,
  listenForMove,
  searchForGame,
} from "../features/playOnline/services/playOnlineService";
import { RouteProp } from "@react-navigation/native";
import { BoardResponse, ChessGameResponse } from "../utils/ServicesTypes";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "PlayOnline",
    undefined
  >;
  route: RouteProp<RootStackParamList, "PlayOnline">;
};

export default function PlayOnline({ navigation, route }: Props) {
  const { request } = route.params;

  const [state, dispatch] = useReducer(reducer, getInitialState());
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
  };

  useEffect(() => {
    searchNewGame();

    return () => {
      unMount();
    };
  }, []);

  const searchNewGame = () => {
    dispatch({ type: "setSearchingGame", payload: true });
    getValueFor("user")
      .then((user) => {
        if (user === null) return;
        return JSON.parse(user) as unknown as User;
      })
      .then((user) => {
        if (user === undefined) return;
        dispatch({ type: "setMyPlayer", payload: userToPlayer(user, null) });

        searchForGame(request)
          .then((response) => {
            if (response.status === 200) {
              response
                .json()
                .then((data: ChessGameResponse) => {
                  dispatch({
                    type: "setUpGame",
                    payload: { chessGameResponse: data, user },
                  });
                  const isMyPlayerWhite =
                    data.whiteUser.nameInGame === user.nameInGame;
                  const myColor = isMyPlayerWhite ? "white" : "black";
                  const opponentColor = isMyPlayerWhite ? "black" : "white";
                  handleListnForFirstMove(
                    data.id,
                    {
                      ...user,
                      color: myColor,
                      timeLeft: new Date(request.timeControl),
                    },
                    responseUserToPlayer(
                      data[`${opponentColor}User`],
                      opponentColor
                    )
                  );
                })
                .catch((err) => {
                  throw new Error(err);
                });
            } else if (response.status === 202) {
              getGameByUsername(user.nameInGame)
                .then((data: ChessGameResponse | undefined) => {
                  if (!data) return;
                  const isMyPlayerWhite =
                    data.whiteUser.nameInGame === user.nameInGame;
                  const myColor = isMyPlayerWhite ? "white" : "black";
                  const opponentColor = isMyPlayerWhite ? "black" : "white";
                  const myPlayer: Player = {
                    ...user,
                    color: myColor,
                    timeLeft: new Date(request.timeControl),
                  };
                  const opponent: Player = responseUserToPlayer(
                    data[`${opponentColor}User`],
                    opponentColor
                  );
                  dispatch({
                    type: "setUpGame",
                    payload: { chessGameResponse: data, user },
                  });
                  handleListnForFirstMove(data.id, myPlayer, opponent)
                    .then((board: BoardResponse) => {
                      console.log("set data from board response");
                      dispatch({
                        type: "setDataFromBoardResponse",
                        payload: { boardResponse: board, myPlayer, opponent },
                      });
                      dispatch({
                        type: "setTimeFromBoardResponse",
                        payload: { boardResponse: board, myPlayer, opponent },
                      });
                      if (board.gameResult !== GameResults.NONE) return;
                      listenForMove({
                        gameId: data.id,
                        moves: board.moves,
                      })
                        .then((board: BoardResponse | undefined) => {
                          if (board === undefined) return;
                          dispatch({
                            type: "setDataFromBoardResponse",
                            payload: {
                              boardResponse: board,
                              myPlayer,
                              opponent,
                            },
                          });
                          dispatch({
                            type: "setTimeFromBoardResponse",
                            payload: {
                              boardResponse: board,
                              myPlayer,
                              opponent,
                            },
                          });
                        })
                        .catch((err) => {
                          throw new Error(err);
                        });
                    })
                    .catch((err) => {
                      throw new Error(err);
                    });
                })
                .catch((err) => {
                  throw new Error(err);
                });
            } else if (response.status === 400) {
              response
                .text()
                .then((data) => {
                  throw new Error(data);
                })
                .catch((error) => {
                  throw new Error(error);
                });
            } else {
              throw new Error("Something went wrong");
            }
          })
          .catch((err) => {
            throw new Error(err);
          });
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const unMount = () => {
    if (!state.searchingGame) return;

    cancelSearch().catch((err) => {
      throw new Error(err);
    });
  };

  const handleListnForFirstMove = async (
    gameId: number,
    myPlayer: Player,
    opponent: Player
  ) => {
    try {
      const res = await listenForFirstMove({ gameId });
      dispatch({
        type: "listenForFirstMove",
        payload: { boardResponse: res, myPlayer, opponent },
      });
      return res;
    } catch (err) {
      if (typeof err === "string") throw new Error(err);
      throw new Error("Unknown error");
    }
  };

  return (
    <View style={styles.container}>
      <SettingsGameModal
        toggleGear={toggleSettings}
        gearModalOn={showSettings}
      />

      <View style={styles.contentContainer}>
        {state.searchingGame || state.myPlayer.color === null ? (
          <WaitingForGame />
        ) : null}
        <Bar state={state} dispatch={dispatch} isMyPlayer={false} />
        <TestBoard state={state} dispatch={dispatch} />
        <PlayOnlineBar
          state={state}
          dispatch={dispatch}
          toggleSettings={toggleSettings}
        />

        <Bar state={state} dispatch={dispatch} isMyPlayer={true} />
        <GameFinishedOverlay
          state={state}
          dispatch={dispatch}
          navigation={navigation}
          searchGame={searchNewGame}
        />
      </View>
      <Footer navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    width: "100%",
    flex: 7,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});
