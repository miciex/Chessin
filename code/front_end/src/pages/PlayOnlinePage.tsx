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
} from "../features/playOnline/services/playOnlineService";
import { ChessGameResponse, BoardResponse } from "../utils/ServicesTypes";
import { User, userToPlayer } from "../utils/PlayerUtilities";
import ChessBoard from "../components/ChessBoard";
import WaitingForGame from "../features/playOnline/components/WaitingForGame";
import { listenForFirstMove } from "../features/playOnline/services/playOnlineService";
import { BoardResponseToBoard } from "../chess-logic/board";
import GameFinishedOverlay from "../features/playOnline/components/GameFinishedOverlay";
import { Move } from "../chess-logic/move";

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

  const [opponent, setOpponent] = useState<Player | null>(null);
  const [myPlayer, setMyPlayer] = useState<Player | null>(null);
  const [opponentClockInfo, setOpponentClockInfo] = useState<Date>();
  const [myClockInfo, setMyClockInfo] = useState<Date>();
  const [lastMoveDate, setLastMoveDate] = useState<Date>();

  const [gearModal, setGearModal] = useState(false);
  //TODO: write reducer for boardState
  const [boardState, setBoardState] = useState<Board>(getInitialChessBoard());
  const [opacityGear, setOpacityGear] = useState(1);
  const [foundGame, setFoundGame] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [searchingGame, setSearchingGame] = useState(true);
  const [gameId, setGameId] = useState<number>(-1);
  const [gameStartedDate, setGameStartedDate] = useState<Date>();

  useEffect(() => {
    searchNewGame();

    return () => {
      unMount();
    };
  }, []);

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
          .then((data: ChessGameResponse) => {
            setUpGame(data, user);
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
    if (myPlayer === null || myPlayer.email === null) {
      getValueFor("user")
        .then((user) => {
          if (user === null) return;
          return JSON.parse(user);
        })
        .then((user: User) => {
          cancelSearch(user.email)
            .then((res) => {
              console.log("game canceled");
            })
            .catch((err) => {
              throw new Error(err);
            });
        })
        .catch((err) => {
          throw new Error(err);
        });
      return;
    }
    cancelSearch(myPlayer.email)
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
      cancelSearch(user.email);
      return;
    }
    handleListnForFirstMove(data.id);
    setFoundGame(true);
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

  const handleListnForFirstMove = (gameId: number) => {
    listenForFirstMove({ gameId })
      .then((res: BoardResponse) => {
        const board: Board = BoardResponseToBoard(res);
        setBoardState(board);
        setGameStartedDate(new Date());
        setGameFinished(false);
        setGameStarted(true);

        setGameStartedDate(new Date(res.lastMoveTime));
        setLastMoveDate(new Date(res.lastMoveTime));

        if (
          (res.whiteTurn && myPlayer?.color === "black") ||
          (!res.whiteTurn && myPlayer?.color === "white")
        ) {
          setMyClockInfo(new Date(res.whiteTime));
        } else if (
          (res.whiteTurn && opponent?.color === "black") ||
          (!res.whiteTurn && opponent?.color === "white")
        ) {
          setOpponentClockInfo(new Date(res.whiteTime));
        }

        setMyClockInfo(
          new Date(myPlayer?.color === "white" ? res.whiteTime : res.blackTime)
        );
        setOpponentClockInfo(
          new Date(opponent?.color === "white" ? res.whiteTime : res.blackTime)
        );
      })
      .catch((err) => {
        throw new Error(err);
      });
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

      <View style={[styles.contentContainer, { opacity: opacityGear }]}>
        <View style={styles.gameRecordContainer}>
          <GameRecord board={boardState} />
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
              setLastMoveDate={setLastMoveDate}
            />
          </View>
          <Text>
            <FontAwesome
              name="gear"
              size={34}
              color="black"
              onPress={toggleGear}
            />
          </Text>
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
});
