import { StyleSheet, View } from "react-native";
import React, { useEffect, useState, useReducer } from "react";
import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../Routing";
import PlayOnlineChessBoard from "../features/playOnline/components/PlayOnlineChessBoard";
import PlayerBar from "../features/playOnline/components/PlayerBar";
import { getInitialChessBoard } from "../features/playOnline";
import GameRecord from "../features/playOnline/components/GameRecord";
import { ColorsPallet } from "../utils/Constants";
import { FontAwesome } from "@expo/vector-icons";
import SettingsGameModal from "../features/gameMenuPage/components/SettingsGameModal";
import {
  Board,
  boardFactory,
  BoardResponseToBoard,
  copyBoard,
  GameResults,
  playMove,
} from "../chess-logic/board";
import {
  Player,
  responseUserToPlayer,
  User,
  userToPlayer,
} from "../utils/PlayerUtilities";
import { getValueFor } from "../utils/AsyncStoreFunctions";
import {
  cancelSearch,
  getGameByUsername,
  listenForFirstMove,
  listenForMove,
  searchForGame,
  submitMove,
} from "../features/playOnline/services/playOnlineService";
import { BoardResponse, ChessGameResponse } from "../utils/ServicesTypes";
import ChessBoard from "../components/ChessBoard";
import WaitingForGame from "../features/playOnline/components/WaitingForGame";
import GameFinishedOverlay from "../features/playOnline/components/GameFinishedOverlay";
import TestBoard from "../features/playOnline/components/Board";
import { Move } from "../chess-logic/move";
import {
  reducer,
  initialState,
} from "../features/playOnline/reducers/PlayOnlineReducer";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "PlayOnline",
    undefined
  >;
  route: RouteProp<RootStackParamList, "PlayOnline">;
};

const timeFinishedDate = new Date(-2);
export default function PlayOnline({ navigation, route }: Props) {
  const { request } = route.params;

  const [playOnlineState, dispatch] = useReducer(reducer, initialState);
  const [opponentClockInfo, setOpponentClockInfo] = useState<Date>();
  const [myClockInfo, setMyClockInfo] = useState<Date>();

  const [gearModal, setGearModal] = useState(false);
  const {
    myPlayer,
    gameFinished,
    opponent,
    board,
    gameId,
    gameStarted,
    searchingGame,
    currentPosition,
  } = playOnlineState;
  useEffect(() => {
    searchNewGame();

    return () => {
      unMount();
    };
  }, []);

  if (myClockInfo && myClockInfo < timeFinishedDate && !gameFinished) {
    submitMove({
      movedPiece: 0,
      gameId: gameId,
      startField: -1,
      endField: -1,
      promotePiece: 0,
      isDrawOffered: false,
    })
      .then((data: BoardResponse) => {
        dispatch({ type: "setGameFinished", payload: true });
        dispatch({ type: "setBoard", payload: BoardResponseToBoard(data) });
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  const searchNewGame = () => {
    dispatch({ type: "setSearchingGame", payload: true });
    getValueFor("user")
      .then((user) => {
        if (user === null) return;
        return JSON.parse(user);
      })
      .then((user: User) => {
        dispatch({ type: "setMyPlayer", payload: userToPlayer(user, null) });

        searchForGame(request)
          .then((response) => {
            if (response.status === 200) {
              response
                .json()
                .then((data: ChessGameResponse) => {
                  setUpGame(data, user);
                  const isMyPlayerWhite =
                    data.whiteUser.nameInGame === user.nameInGame;
                  const myColor = isMyPlayerWhite ? "white" : "black";
                  const opponentColor = isMyPlayerWhite ? "black" : "white";
                  handleListnForFirstMove(
                    data.id,
                    userToPlayer(user, myColor),
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
                  if (data === undefined) return;
                  setUpGame(data, user);
                  const isMyPlayerWhite =
                    data.whiteUser.nameInGame === user.nameInGame;
                  const myColor = isMyPlayerWhite ? "white" : "black";
                  const opponentColor = isMyPlayerWhite ? "black" : "white";
                  handleListnForFirstMove(
                    data.id,
                    userToPlayer(user, myColor),
                    responseUserToPlayer(
                      data[`${opponentColor}User`],
                      opponentColor
                    )
                  )
                    .then((board: BoardResponse) => {
                      const myPlayer: Player = userToPlayer(user, myColor);
                      const opponent = responseUserToPlayer(
                        data[`${opponentColor}User`],
                        opponentColor
                      );
                      setDataFromBoardResponse(board, myPlayer, opponent);
                      setTimeFromBoardResponse(board, myPlayer, opponent);
                      listenForMove({
                        gameId: data.id,
                        moves: board.moves,
                      })
                        .then((board: BoardResponse | undefined) => {
                          if (board === undefined) return;
                          setDataFromBoardResponse(board, myPlayer, opponent);
                          setTimeFromBoardResponse(board, myPlayer, opponent);
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
    if (!searchingGame) return;

    cancelSearch().catch((err) => {
      throw new Error(err);
    });
  };

  const toggleGear = () => {
    setGearModal(!gearModal);
  };

  const setUpGame = (data: ChessGameResponse, user: User) => {
    if (data.blackUser === null || data.whiteStarts === null) {
      dispatch({ type: "setSearchingGame", payload: false });
      cancelSearch().catch((err) => {
        throw new Error(err);
      });
      return;
    }

    dispatch({ type: "setGameId", payload: data.id });
    if (data.whiteUser.nameInGame === user.nameInGame) {
      dispatch({
        type: "setOpponent",
        payload: responseUserToPlayer(data.blackUser, "black"),
      });
      dispatch({ type: "setMyPlayer", payload: userToPlayer(user, "white") });
    } else if (data.blackUser.nameInGame === user.nameInGame) {
      dispatch({
        type: "setOpponent",
        payload: responseUserToPlayer(data.whiteUser, "white"),
      });
      dispatch({ type: "setMyPlayer", payload: userToPlayer(user, "black") });
    }

    setMyClockInfo(new Date(data.timeControl));
    setOpponentClockInfo(new Date(data.timeControl));

    dispatch({
      type: "setBoard",
      payload: boardFactory({
        fenString: data.startBoard,
        whiteToMove: data.whiteStarts,
      }),
    });
    dispatch({ type: "setSearchingGame", payload: false });
  };

  const handleListnForFirstMove = async (
    gameId: number,
    myPlayer: Player,
    opponent: Player
  ) => {
    return await listenForFirstMove({ gameId })
      .then((res: BoardResponse) => {
        setDataFromBoardResponse(res, myPlayer, opponent);
        setTimeFromBoardResponse(res, myPlayer, opponent);
        return res;
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const setDataFromBoardResponse = (
    res: BoardResponse,
    myPlayer: Player,
    opponent: Player
  ) => {
    const board: Board = BoardResponseToBoard(res);
    dispatch({ type: "setBoard", payload: board });
    dispatch({ type: "setGameFinished", payload: false });
    dispatch({ type: "setCurrentPosition", payload: res.moves.length - 1 });
  };

  const setTimeFromBoardResponse = (
    res: BoardResponse,
    myPlayer: Player,
    opponent: Player
  ) => {
    let myTime = myPlayer?.color === "white" ? res.whiteTime : res.blackTime;
    let opponentTime =
      opponent?.color === "white" ? res.whiteTime : res.blackTime;
    setMyClockInfo(new Date(myTime));
    setOpponentClockInfo(new Date(opponentTime));
  };
  const updateMyClockInSeconds = (millis: number) => {
    setMyClockInfo((prev) => {
      if (prev === undefined) return prev;
      return new Date(prev.setMilliseconds(prev.getMilliseconds() + millis));
    });
  };

  const updateOpponentClockInSeconds = (millis: number) => {
    setOpponentClockInfo((prev) => {
      if (prev === undefined) return prev;
      return new Date(prev.setMilliseconds(prev.getMilliseconds() + millis));
    });
  };

  const settings = gearModal ? (
    <>
      <SettingsGameModal toggleGear={toggleGear} gearModalOn={gearModal} />
    </>
  ) : null;

  const gameFinishedOverlay =
    board.result !== GameResults.NONE ? (
      <View style={styles.gameFinishedOverlayOuterContainer}>
        <View style={styles.gameFinishedOverlayInnerContainer}>
          <GameFinishedOverlay
            navigation={navigation}
            state={playOnlineState}
            dispatch={dispatch}
          />
        </View>
      </View>
    ) : null;

  return !searchingGame && myPlayer && myPlayer.color !== null ? (
    <View style={styles.appContainer}>
      {settings}

      <View style={styles.contentContainer}>
        <View style={styles.gameRecordContainer}>
          <GameRecord state={playOnlineState} dispatch={dispatch} />
        </View>
        <View style={styles.mainContentContainer}>
          <View style={styles.playerBarContainer}>
            <PlayerBar
              player={opponent}
              timerInfo={opponentClockInfo}
              board={board}
              gameStarted={gameStarted}
              gameFinished={gameFinished}
              changeTimerBySeconds={updateOpponentClockInSeconds}
            />
          </View>
          <View style={styles.boardContainer}>
            <TestBoard state={playOnlineState} dispatch={dispatch} />
          </View>
          <View style={styles.gameOptionsContainer}>
            <FontAwesome
              name="flag-o"
              size={34}
              color="black"
              onPress={() => {}}
            />
            <FontAwesome
              name="gear"
              size={34}
              color="black"
              onPress={toggleGear}
            />
          </View>
          <View style={styles.playerBarContainer}>
            <PlayerBar
              player={myPlayer}
              timerInfo={myClockInfo}
              board={board}
              gameStarted={gameStarted}
              gameFinished={gameFinished}
              changeTimerBySeconds={updateMyClockInSeconds}
            />
          </View>
        </View>
      </View>
      {gameFinishedOverlay}
      <Footer navigation={navigation} />
    </View>
  ) : (
    <View style={styles.appContainer}>
      <View style={styles.searchingGameContentContainer}>
        <View style={styles.boardContainer}>
          <TestBoard state={playOnlineState} dispatch={dispatch} />
        </View>
        <View>
          <FontAwesome
            name="gear"
            size={34}
            color="black"
            onPress={toggleGear}
          />
        </View>
        <View style={styles.waitingForGameContainer}>
          <WaitingForGame />
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
    alignItems: "center",
  },
  contentContainer: {
    flex: 8,
    alignItems: "center",
    gap: 16,
    width: "100%",
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
    backgroundColor: ColorsPallet.dark,
  },
  mainContentContainer: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    gap: 16,
    justifyContent: "space-evenly",
  },
  searchingGameContentContainer: {
    flex: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  waitingForGameContainer: {
    width: "95%",
    height: "80%",
    position: "absolute",
  },
  gameFinishedOverlayOuterContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  gameFinishedOverlayInnerContainer: {
    marginTop: "30%",
    width: "95%",
    height: "63%",
    position: "absolute",
  },
  gameOptionsContainer: {
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    height: 50,
  },
});
