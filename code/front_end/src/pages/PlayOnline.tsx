import { View, StyleSheet, ScrollView } from "react-native";
import React, { useState, useReducer, useEffect } from "react";
import { GameResults, GameType } from "../chess-logic/board";
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
  getBoardByGameId,
  getGameByUsername,
  listenForFirstMove,
  listenForMove,
  searchForGame,
} from "../features/playOnline/services/playOnlineService";
import { RouteProp } from "@react-navigation/native";
import {
  BoardResponse,
  BooleanMessageResponse,
  ChessGameResponse,
  MessageResponse,
  RespondToDrawOfferRequest,
} from "../utils/ServicesTypes";
import GameRecord from "../features/playOnline/components/GameRecord";
import { ColorsPallet } from "../utils/Constants";
import {
  isUserPlaying,
  isUserPlayingTimeControl,
  listenForDisconnections,
  listenForDrawOffer,
  listenForResignation,
  offerDraw,
  ping,
  resign,
  respondToDrawOffer,
} from "../services/chessGameService";
import MessageQueue from "react-native/Libraries/BatchedBridge/MessageQueue";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "PlayOnline",
    undefined
  >;
  route: RouteProp<RootStackParamList, "PlayOnline">;
};

export default function PlayOnline({ navigation, route }: Props) {
  const request = route.params?.request;

  const [state, dispatch] = useReducer(
    reducer,
    getInitialState(request?.isRated, request?.gameType)
  );
  const [showSettings, setShowSettings] = useState(false);
  const [rotateBoard, setRotateBoard] = useState(false);
  const [opponentOfferedDraw, setOpponentOfferedDraw] = useState(false);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);

  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
  };

  const toggleRotateBoard = () => {
    setRotateBoard((prev) => !prev);
  };

  const opponentOfferedDrawTrue = () => {
    setOpponentOfferedDraw(true);
    console.log("opponentOfferedDraw")
  };

  const opponentOfferedDrawFalse = () => {
    setOpponentOfferedDraw(false);
  };

  useEffect(() => {
    searchNewGame();

    return () => {
      unMount();
    };
  }, []);

  useEffect(() => {
    if(state.gameId<0) return;
    if(state.myPlayer.color == undefined) return;
    const interval = setInterval(() => {
      handlePing(String(state.gameId))
      .catch(()=>{
        throw new Error("Error while pinging");
      })
    }, 10000);
    handleListenForDisconnect(String(state.gameId))
    .catch(()=>{
      throw new Error("Error while listening for disconnect");
    });
    return () => clearInterval(interval);
  },[state.gameId])


  const setRotateBoardAfterFoundGame = (isMyPlayerWhite: boolean) => {
    if (isMyPlayerWhite) setRotateBoard(false);
    else setRotateBoard(true);
  };

  const handleListenForDrawOffer = (gameId: string) => {
    listenForDrawOffer(gameId)
    .then((msg: MessageQueue | null) => {
      if(!msg) return;
      setOpponentOfferedDraw(true);
    })
    .catch((err) => {
      throw new Error(err);
    });
  }

  const handleListenForResign = (gameId: string) => {
    listenForResignation(gameId)
    .then((response : BoardResponse | null) => {
      if (response === null) return;
      dispatch({
        type: "setDataFromBoardResponse",
        payload: { boardResponse: response },
      });
    }).
    catch((err) => {
      throw new Error(err)
    });
  }

  const handleResign = (gameId: string) => {
    resign(gameId)
    .then((response : BoardResponse | null) => {
      if (response === null) return;
      dispatch({
        type: "setDataFromBoardResponse",
        payload: { boardResponse: response },
      });
    }).
    catch((err) => {
      throw new Error(err)
    });
  }

  const handlePing = async (gameId: string) => {
    ping(gameId)
    .then((response :MessageResponse| BoardResponse | null) => {
      if (!response){ 
        //opponent reconnected
        setOpponentDisconnected(false);
        handleListenForDisconnect(gameId)
        .catch((err) => {
          throw new Error(err);
        }); 
      }
      else if("message" in response){
        //opponent didn't disconnect
        setOpponentDisconnected(false);
      }
      else{
        //opponent disconnected
        setOpponentDisconnected(true);
        dispatch({
          type: "setDataFromBoardResponse",
          payload: { boardResponse: response },
        });
      }
    }).
    catch((err) => {
      throw new Error(err)
    });
  }

  const handleListenForDisconnect = async (gameId: string) => {
    listenForDisconnections(gameId)
    .then((response: MessageResponse | null) => {
      if (response === null) return;
      setOpponentDisconnected(true);
    })
    .catch((err) => {
      throw new Error(err);
    });
  };

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
        isUserPlaying(user.nameInGame)
        .then((response:BooleanMessageResponse) => {
          if(response.message === "True") {
            getGameByUsername(user.nameInGame)
                .then((data: ChessGameResponse | undefined) => {
                  if (!data) return;
                  const isMyPlayerWhite =
                    data.whiteUser.nameInGame === user.nameInGame;
                  const myColor = isMyPlayerWhite ? "white" : "black";
                  handleListenForDrawOffer(String(data.id));
                  handleListenForResign(String(data.id));
                  setRotateBoardAfterFoundGame(isMyPlayerWhite);
                  dispatch({
                    type: "setUpGame",
                    payload: {
                      chessGameResponse: data,
                      nameInGame: user.nameInGame,
                    },
                  });
                  getBoardByGameId(data.id).then(
                    (boardResponse: BoardResponse) => {
                      dispatch({
                        type: "setDataFromBoardResponse",
                        payload: { boardResponse },
                      });
                      if (
                        boardResponse.gameResult !== GameResults.NONE ||
                        boardResponse.whiteTurn === (myColor === "white")
                      )
                        return;
                      listenForMove({
                        gameId: data.id,
                        moves: boardResponse.moves,
                      })
                        .then((board: BoardResponse | undefined) => {
                          if (board === undefined) return;
                          dispatch({
                            type: "setDataFromBoardResponse",
                            payload: {
                              boardResponse: board,
                            },
                          });
                        })
                        .catch((err) => {
                          throw new Error(err);
                        });

                    }
                  );
                })
                .catch((err) => {
                  throw new Error(err);
                });
          }else if(request){
        searchForGame(request)
          .then((response) => {
            if (response.status === 200) {
              response
                .json()
                .then((data: ChessGameResponse) => {
                  if (!data) return;
                  handleListenForDrawOffer(String(data.id));
                  handleListenForResign(String(data.id));
                  dispatch({
                    type: "setUpGame",
                    payload: {
                      chessGameResponse: data,
                      nameInGame: request.nameInGame,
                    },
                  });
                  const isMyPlayerWhite =
                    data.whiteUser.nameInGame === user.nameInGame;
                  const myColor = isMyPlayerWhite ? "white" : "black";
                  const opponentColor = isMyPlayerWhite ? "black" : "white";
                  setRotateBoardAfterFoundGame(isMyPlayerWhite);
                  getBoardByGameId(data.id).then(
                    (boardResponse: BoardResponse) => {
                      dispatch({
                        type: "setDataFromBoardResponse",
                        payload: { boardResponse },
                      });

                      if (boardResponse.gameResult !== GameResults.NONE) return;
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
                      ).catch((err) => {
                        throw new Error(err);
                      });

                    }
                  );
                })
                .catch((err) => {
                  throw new Error(err);
                });
            }  else {
              throw new Error("Something went wrong while searching for game");
            }
          })
          .catch((err) => {
            throw new Error(err);
          });
        }
        else {
          navigation.navigate("GameMenu");
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
    }).catch((err) => {
      throw new Error(err);
    })
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

  const setCurrentPosition = (position: number) => {
    dispatch({ type: "setCurrentPosition", payload: position });
  };

  const handleResponseFromDrawOffer = (board: BoardResponse | null) => {
    if (!board) {
      setOpponentOfferedDraw(false);
      return listenForDrawOffer(String(state.gameId))
        .then((msg: MessageResponse | null) => {
          if(!msg) return;
          setOpponentOfferedDraw(true);
          listenForDrawOffer(String(state.gameId));
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
    dispatch({
      type: "setDataFromBoardResponse",
      payload: { boardResponse: board },
    });
    setOpponentOfferedDraw(false);
  }

  const handleRespondToDrawOffer = (response: RespondToDrawOfferRequest) => {
    respondToDrawOffer(response)
      .then((board: BoardResponse | null) => {
        handleResponseFromDrawOffer(board);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const handleOfferDraw = () => {
    offerDraw(String(state.gameId))
    .then((board: BoardResponse | null) => {
      handleResponseFromDrawOffer(board);
    })
    .catch((err) => {
      throw new Error(err);
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.gameRecordContainer}>
        <ScrollView horizontal={true}>
          <GameRecord
            moves={state.board.moves}
            positions={state.board.positions}
            currentPosition={state.currentPosition}
            setCurrentPosition={setCurrentPosition}
          />
        </ScrollView>
      </View>

      <SettingsGameModal
        toggleGear={toggleSettings}
        gearModalOn={showSettings}
      />

      <View style={styles.contentContainer}>
        {state.searchingGame || state.myPlayer.color === null ? (
          <WaitingForGame />
        ) : null}
        <Bar state={state} dispatch={dispatch} rotateBoard={!rotateBoard} />
        <TestBoard
          state={state}
          dispatch={dispatch}
          rotateBoard={rotateBoard}
          ableToMove={true}
        />
        <PlayOnlineBar
          state={state}
          dispatch={dispatch}
          toggleSettings={toggleSettings}
          toggleRotateBoard={toggleRotateBoard}
          opponentOfferedDraw={opponentOfferedDraw}
          handleRespondToDrawOffer={handleRespondToDrawOffer}
          handleSendDrawOffer={handleOfferDraw}
          handleResign={handleResign}
          opponentDisconnected={opponentDisconnected}
        />

        <Bar state={state} dispatch={dispatch} rotateBoard={rotateBoard} />
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
  gameRecordContainer: {
    width: "100%",
    height: 24,
    justifyContent: "center",
    backgroundColor: ColorsPallet.dark,
  },
});
