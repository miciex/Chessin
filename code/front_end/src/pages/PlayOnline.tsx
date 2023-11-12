import { View, StyleSheet, ScrollView } from "react-native";
import React, { useReducer, useEffect } from "react";
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
  DisconnectionResponse,
  DisconnectionStatus,
  MessageResponse,
  PendingChessGameRequest,
  RespondToDrawOfferRequest,
} from "../utils/ServicesTypes";
import GameRecord from "../features/playOnline/components/GameRecord";
import { ColorsPallet } from "../utils/Constants";
import {
  isUserPlaying,
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

  useEffect(() => {
    searchNewGame();

    return () => {
      unMount();
    };
  }, []);

  useEffect(() => {
    if (state.gameId < 0) return;
    if (state.myPlayer.color == undefined) return;
    console.log("game result: " + JSON.stringify(state.board.result));
    if (state.board.result !== GameResults.NONE) return;
    const interval = setInterval(() => {
      handlePing(String(state.gameId)).catch(() => {
        throw new Error("Error while pinging");
      });
    }, 10000);
    handleListenForDisconnect(String(state.gameId)).catch(() => {
      throw new Error("Error while listening for disconnect");
    });
    return () => clearInterval(interval);
  }, [state.gameId, state.board.result]);

  const setRotateBoardAfterFoundGame = (isMyPlayerWhite: boolean) => {
    if (isMyPlayerWhite) dispatch({ type: "setRotateBoard", payload: false });
    else dispatch({ type: "setRotateBoard", payload: true });
  };

  const handleListenForDrawOffer = (gameId: string) => {
    listenForDrawOffer(gameId)
      .then((msg: MessageQueue | null) => {
        if (!msg) return;
        dispatch({ type: "setOpponentOfferedDraw", payload: true });
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const handleListenForResign = (gameId: string) => {
    listenForResignation(gameId)
      .then((response: BoardResponse | null) => {
        if (response === null) return;
        dispatch({
          type: "setDataFromBoardResponse",
          payload: { boardResponse: response },
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const handleResign = (gameId: string) => {
    resign(gameId)
      .then((response: BoardResponse | null) => {
        if (response === null) return;
        dispatch({
          type: "setDataFromBoardResponse",
          payload: { boardResponse: response },
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const handlePing = async (gameId: string) => {
    ping(gameId)
      .then((response: DisconnectionStatus | BoardResponse) => {
        if (typeof response === "string") {
          switch (response as DisconnectionStatus) {
            case DisconnectionStatus.DISCONNECTED:
              dispatch({ type: "setOpponentDisconnected", payload: true });
              dispatch({ type: "setOpponentReconnected", payload: false });
              break;
            case DisconnectionStatus.RECONNECTED:
              dispatch({ type: "setOpponentDisconnected", payload: false });
              dispatch({ type: "setOpponentReconnected", payload: true });
              break;
            case DisconnectionStatus.FINE:
            case DisconnectionStatus.NO_CHANGE:
              return;
          }
        } else {
          //opponent disconnected
          dispatch({ type: "setOpponentDisconnected", payload: true });
          dispatch({
            type: "setDataFromBoardResponse",
            payload: { boardResponse: response },
          });
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const handleListenForDisconnect = async (gameId: string) => {
    listenForDisconnections(gameId)
      .then((response: DisconnectionResponse | null) => {
        if (response === null) return;
        if (DisconnectionStatus.DISCONNECTED === response.disconnectionStatus) {
          dispatch({ type: "setOpponentDisconnected", payload: true });
          dispatch({ type: "setOpponentReconnected", payload: false });
          dispatch({
            type: "setDisconnectionTimer",
            payload: new Date(response.disconnectionTime),
          });
        } else if (
          DisconnectionStatus.RECONNECTED === response.disconnectionStatus
        ) {
          dispatch({ type: "setOpponentDisconnected", payload: false });
          dispatch({ type: "setOpponentReconnected", payload: false });
          dispatch({
            type: "setDisconnectionTimer",
            payload: new Date(response.disconnectionTime),
          });
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const handleJoinToExistingGame = async (user: User) => {
    getGameByUsername(user.nameInGame)
      .then((data: ChessGameResponse | undefined) => {
        if (!data) return;
        const isMyPlayerWhite = data.whiteUser.nameInGame === user.nameInGame;
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
        getBoardByGameId(data.id).then((boardResponse: BoardResponse) => {
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
            .then((board: BoardResponse | null) => {
              if (!board) return;
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
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const handleSearchForGame = async (
    user: User,
    request: PendingChessGameRequest
  ) => {
    searchForGame(request)
      .then((data: ChessGameResponse | null) => {
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
        const isMyPlayerWhite = data.whiteUser.nameInGame === user.nameInGame;
        const myColor = isMyPlayerWhite ? "white" : "black";
        const opponentColor = isMyPlayerWhite ? "black" : "white";
        setRotateBoardAfterFoundGame(isMyPlayerWhite);
        getBoardByGameId(data.id).then(
          (boardResponse: BoardResponse | null) => {
            if (!boardResponse) return;
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
              responseUserToPlayer(data[`${opponentColor}User`], opponentColor)
            ).catch((err) => {
              throw new Error(err);
            });
          }
        );
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
          .then((response: BooleanMessageResponse) => {
            if (response.message === "True") {
              handleJoinToExistingGame(user).catch((err) => {
                throw new Error(err);
              });
            } else if (request) {
              handleSearchForGame(user, request).catch((err) => {
                throw new Error(err);
              });
            } else {
              navigation.navigate("GameMenu");
            }
          })
          .catch((err) => {
            throw new Error(err);
          });
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
    listenForFirstMove({ gameId })
      .then((res: BoardResponse | null) => {
        if (!res) return;
        dispatch({
          type: "listenForFirstMove",
          payload: { boardResponse: res, myPlayer, opponent },
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const setCurrentPosition = (position: number) => {
    dispatch({ type: "setCurrentPosition", payload: position });
  };

  const handleResponseFromDrawOffer = (board: BoardResponse | null) => {
    if (!board) {
      dispatch({ type: "setOpponentOfferedDraw", payload: false });
      return listenForDrawOffer(String(state.gameId))
        .then((msg: MessageResponse | null) => {
          if (!msg) return;
          dispatch({ type: "setOpponentOfferedDraw", payload: true });
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
    dispatch({ type: "setOpponentOfferedDraw", payload: false });
  };

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
  };

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
        toggleGear={() => {
          dispatch({ type: "toggleSettings" });
        }}
        gearModalOn={state.showSettings}
      />

      <View style={styles.contentContainer}>
        {state.searchingGame || state.myPlayer.color === null ? (
          <WaitingForGame />
        ) : null}
        <Bar
          state={state}
          dispatch={dispatch}
          rotateBoard={!state.rotateBoard}
        />
        <TestBoard
          state={state}
          dispatch={dispatch}
          rotateBoard={state.rotateBoard}
          ableToMove={true}
        />
        <PlayOnlineBar
          state={state}
          dispatch={dispatch}
          handleRespondToDrawOffer={handleRespondToDrawOffer}
          handleSendDrawOffer={handleOfferDraw}
          handleResign={handleResign}
        />

        <Bar
          state={state}
          dispatch={dispatch}
          rotateBoard={state.rotateBoard}
        />
        <GameFinishedOverlay
          state={state}
          dispatch={dispatch}
          navigation={navigation}
          searchGame={handleSearchForGame}
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
