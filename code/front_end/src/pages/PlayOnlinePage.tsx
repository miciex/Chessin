import { View, Text, StyleSheet, Modal, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
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
  GameResults,
  boardFactory,
  playMove,
  copyBoard,
} from "../chess-logic/board";
import { Player, responseUserToPlayer } from "../utils/PlayerUtilities";
import { getValueFor } from "../utils/AsyncStoreFunctions";
import {
  cancelSearch,
  searchForGame,
  getGameByUsername,
  listenForMove,
} from "../features/playOnline/services/playOnlineService";
import { ChessGameResponse, BoardResponse } from "../utils/ServicesTypes";
import { User, userToPlayer } from "../utils/PlayerUtilities";
import ChessBoard from "../components/ChessBoard";
import WaitingForGame from "../features/playOnline/components/WaitingForGame";
import { listenForFirstMove } from "../features/playOnline/services/playOnlineService";
import { BoardResponseToBoard } from "../chess-logic/board";
import GameFinishedOverlay from "../features/playOnline/components/GameFinishedOverlay";
import { Move } from "../chess-logic/move";
import { submitMove } from "../features/playOnline/services/playOnlineService";

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

  const [opponent, setOpponent] = useState<Player | null>(null);
  const [myPlayer, setMyPlayer] = useState<Player | null>(null);
  const [opponentClockInfo, setOpponentClockInfo] = useState<Date>();
  const [myClockInfo, setMyClockInfo] = useState<Date>();

  const [gearModal, setGearModal] = useState(false);
  //TODO: write reducer for boardState
  const [boardState, setBoardState] = useState<Board>(getInitialChessBoard());
  const [gameFinished, setGameFinished] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [searchingGame, setSearchingGame] = useState(true);
  const [gameId, setGameId] = useState<number>(-1);
  const [currentPosition, setCurrentPosition] = useState<number>(0);

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
        setGameFinished(true);
        setBoardState(BoardResponseToBoard(data));
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  const searchNewGame = () => {
    setSearchingGame(true);
    getValueFor("user")
      .then((user) => {
        if (user === null) return;
        return JSON.parse(user);
      })
      .then((user: User) => {
        setMyPlayer(userToPlayer(user, null));

        searchForGame(request)
          .then((response) => {
            if (response.status === 200) {
              response
                .json()
                .then((data: ChessGameResponse) => {
                  console.log("data", data);
                  setUpGame(data, user);
                  handleListnForFirstMove(
                    data.id,
                    data.whiteUser.nameInGame === user.nameInGame
                      ? { ...user, color: "white" }
                      : { ...user, color: "black" },
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
                  setUpGame(data, user);
                  handleListnForFirstMove(
                    data.id,
                    data.whiteUser.nameInGame === user.nameInGame
                      ? { ...user, color: "white" }
                      : { ...user, color: "black" },
                    data.whiteUser.nameInGame === user.nameInGame
                      ? responseUserToPlayer(data.blackUser, "black")
                      : responseUserToPlayer(data.whiteUser, "white")
                  )
                    .then((board: BoardResponse) => {
                      const myPlayer: Player =
                        data.whiteUser.nameInGame === user.nameInGame
                          ? { ...user, color: "white" }
                          : { ...user, color: "black" };
                      const opponent =
                        data.whiteUser.nameInGame === user.nameInGame
                          ? responseUserToPlayer(data.blackUser, "black")
                          : responseUserToPlayer(data.whiteUser, "white");
                      setDataFromBoardResponse(board, myPlayer, opponent);
                      setTimeFromBoardResponse(board, myPlayer, opponent);
                      listenForMove({
                        gameId: data.id,
                        moves: board.moves,
                      })
                        .then((board: BoardResponse | undefined) => {
                          if (board === undefined) return;
                          const myPlayer: Player =
                            data.whiteUser.nameInGame === user.nameInGame
                              ? { ...user, color: "white" }
                              : { ...user, color: "black" };
                          const opponent =
                            data.whiteUser.nameInGame === user.nameInGame
                              ? responseUserToPlayer(data.blackUser, "black")
                              : responseUserToPlayer(data.whiteUser, "white");
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

    cancelSearch()
      .then((res) => {
        console.log("game canceled");
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const toggleGear = () => {
    setGearModal(!gearModal);
  };

  const setUpGame = (data: ChessGameResponse, user: User) => {
    if (data.blackUser === null || data.whiteStarts === null) {
      setSearchingGame(false);
      cancelSearch();
      return;
    }

    setGameId(data.id);
    if (data.whiteUser.nameInGame === user.nameInGame) {
      setOpponent(responseUserToPlayer(data.blackUser, "black"));
      setMyPlayer({ ...user, color: "white" });
    } else if (data.blackUser.nameInGame === user.nameInGame) {
      setOpponent(responseUserToPlayer(data.whiteUser, "white"));
      setMyPlayer({ ...user, color: "black" });
    }

    setMyClockInfo(new Date(data.timeControl));
    setOpponentClockInfo(new Date(data.timeControl));

    setBoardState(
      boardFactory({
        fenString: data.startBoard,
        whiteToMove: data.whiteStarts,
      })
    );
    setSearchingGame(false);
  };

  const handleListnForFirstMove = async (
    gameId: number,
    myPlayer: Player,
    opponent: Player
  ) => {
    console.log("listening for first move");
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
    setBoardState(board);
    setGameFinished(false);
    console.log("my player", myPlayer, "opponent", opponent);

    setCurrentPosition(res.moves.length - 1);
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

  const PlayMove = (move: Move) => {
    setBoardState((prevBoard) => {
      let newBoard = playMove(move, copyBoard(prevBoard));

      return newBoard;
    });
  };
  const settings = gearModal ? (
    <>
      <SettingsGameModal toggleGear={toggleGear} gearModalOn={gearModal} />
    </>
  ) : null;

  const gameFinishedOverlay =
    boardState.result !== GameResults.NONE ? (
      <View style={styles.gameFinishedOverlayOuterContainer}>
        <View style={styles.gameFinishedOverlayInnerContainer}>
          <GameFinishedOverlay
            navigation={navigation}
            whoWon={boardState.result}
            searchForGame={searchNewGame}
            whitesTurn={boardState.whiteToMove}
          />
        </View>
      </View>
    ) : null;

  return !searchingGame && myPlayer && myPlayer.color !== null ? (
    <View style={styles.appContainer}>
      {settings}

      <View style={styles.contentContainer}>
        <View style={styles.gameRecordContainer}>
          <GameRecord
            board={boardState}
            currentPosition={currentPosition}
            setCurrentPosition={setCurrentPosition}
          />
        </View>
        <View style={styles.mainContentContainer}>
          <View style={styles.playerBarContainer}>
            <PlayerBar
              player={opponent}
              timerInfo={opponentClockInfo}
              board={boardState}
              gameStarted={gameStarted}
              gameFinished={gameFinished}
              changeTimerBySeconds={updateOpponentClockInSeconds}
            />
          </View>
          <View style={styles.boardContainer}>
            <PlayOnlineChessBoard
              board={boardState}
              setBoard={setBoardState}
              player={myPlayer}
              gameId={gameId}
              playMove={PlayMove}
              setMyClockInfo={setMyClockInfo}
              setOpponentClockInfo={setOpponentClockInfo}
              currentPosition={currentPosition}
              setGameStarted={setGameStarted}
              setCurrentPosition={setCurrentPosition}
            />
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
              board={boardState}
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
          <ChessBoard />
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
