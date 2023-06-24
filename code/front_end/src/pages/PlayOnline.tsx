import { View, Text, StyleSheet } from "react-native";
import React, { useState, useReducer, useEffect } from "react";
import { Board, BoardResponseToBoard, playMove } from "../chess-logic/board";
import {
  Player,
  User,
  getBasePlayer,
  responseUserToPlayer,
  userToPlayer,
} from "../utils/PlayerUtilities";
import PlayOnlineOptions from "../features/gameMenuPage/components/PlayOnlineOptions";
import TestBoard from "../features/playOnline/components/Board";
import PlayerBar from "../features/playOnline/components/PlayerBar";
import { Move } from "../chess-logic/move";
import { getInitialChessBoard } from "../features/playOnline";
import Bar from "../features/playOnline/components/Bar";
import PlayOnlineBar from "../features/playOnline/components/PlayOnlineBar";
import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../utils/Constants";
import { RootStackParamList } from "../../Routing";
import SettingsGameModal from "../features/gameMenuPage/components/SettingsGameModal";
import WaitingForGame from "../features/playOnline/components/WaitingForGame";
import WaitingScreen from "../features/playOnline/components/WaitingScreen";
import GameFinishedOverlay from "../features/playOnline/components/GameFinishedOverlay";
import {
  initialState,
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

  const [state, dispatch] = useReducer(reducer, initialState);
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
            console.log(response.status);
            if (response.status === 200) {
              response
                .json()
                .then((data: ChessGameResponse) => {
                  // console.log("got game");
                  console.log(data);
                  dispatch({
                    type: "setUpGame",
                    payload: { chessGameResponse: data, user },
                  });
                  handleListnForFirstMove(
                    data.id,
                    data.whiteUser.nameInGame === user.nameInGame
                      ? {
                          ...user,
                          color: "white",
                          timeLeft: new Date(request.timeControl),
                        }
                      : {
                          ...user,
                          color: "black",
                          timeLeft: new Date(request.timeControl),
                        },
                    data.whiteUser.nameInGame === user.nameInGame
                      ? responseUserToPlayer(data.blackUser, "black")
                      : responseUserToPlayer(data.whiteUser, "white")
                  );
                })
                .catch((err) => {
                  throw new Error(err);
                });
            } else if (response.status === 202) {
              getGameByUsername(user.nameInGame)
                .then((data: ChessGameResponse | undefined) => {
                  if (data === undefined) return;
                  console.log("got game");
                  console.log(data);
                  dispatch({
                    type: "setUpGame",
                    payload: { chessGameResponse: data, user },
                  });
                  handleListnForFirstMove(
                    data.id,
                    data.whiteUser.nameInGame === user.nameInGame
                      ? {
                          ...user,
                          color: "white",
                          timeLeft: new Date(request.timeControl),
                        }
                      : {
                          ...user,
                          color: "black",
                          timeLeft: new Date(request.timeControl),
                        },
                    data.whiteUser.nameInGame === user.nameInGame
                      ? responseUserToPlayer(data.blackUser, "black")
                      : responseUserToPlayer(data.whiteUser, "white")
                  )
                    .then((board: BoardResponse) => {
                      console.log("data", board);
                      const myPlayer: Player =
                        data.whiteUser.nameInGame === user.nameInGame
                          ? {
                              ...user,
                              color: "white",
                              timeLeft: new Date(request.timeControl),
                            }
                          : {
                              ...user,
                              color: "black",
                              timeLeft: new Date(request.timeControl),
                            };
                      const opponent =
                        data.whiteUser.nameInGame === user.nameInGame
                          ? responseUserToPlayer(data.blackUser, "black")
                          : responseUserToPlayer(data.whiteUser, "white");
                      dispatch({
                        type: "setDataFromBoardResponse",
                        payload: { boardResponse: board, myPlayer, opponent },
                      });
                      dispatch({
                        type: "setTimeFromBoardResponse",
                        payload: { boardResponse: board, myPlayer, opponent },
                      });
                      listenForMove({
                        gameId: data.id,
                        moves: board.moves,
                      })
                        .then((board: BoardResponse | undefined) => {
                          if (board === undefined) return;
                          const myPlayer: Player =
                            data.whiteUser.nameInGame === user.nameInGame
                              ? {
                                  ...user,
                                  color: "white",
                                  timeLeft: new Date(request.timeControl),
                                }
                              : {
                                  ...user,
                                  color: "black",
                                  timeLeft: new Date(request.timeControl),
                                };
                          const opponent =
                            data.whiteUser.nameInGame === user.nameInGame
                              ? responseUserToPlayer(data.blackUser, "black")
                              : responseUserToPlayer(data.whiteUser, "white");
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

    cancelSearch()
      .then((res) => {
        console.log("game canceled");
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  // console.log(state);

  const handleListnForFirstMove = async (
    gameId: number,
    myPlayer: Player,
    opponent: Player
  ) => {
    return await listenForFirstMove({ gameId })
      .then((res: BoardResponse) => {
        dispatch({
          type: "listenForFirstMove",
          payload: { boardResponse: res, myPlayer, opponent },
        });
        return res;
      })
      .catch((err) => {
        throw new Error(err);
      });
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
