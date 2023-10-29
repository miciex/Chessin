import {
  BoardResponseToOnlineBoard,
  GameType,
  OnlineBoardType,
  playMove,
} from "../../../chess-logic/board";
import {
  Player,
  User,
  getBasePlayer,
  responseUserToPlayer,
} from "../../../utils/PlayerUtilities";
import { Move } from "../../../chess-logic/move";
import { getInitialOnlineBoard } from "..";
import { BoardResponse, ChessGameResponse } from "../../../utils/ServicesTypes";

export type PlayOnlineState = {
  board: OnlineBoardType;
  myPlayer: Player;
  opponent: Player;
  gameFinished: boolean;
  gameStarted: boolean;
  searchingGame: boolean;
  gameId: number;
  currentPosition: number;
};

export type PlayOnlineAction =
  | {
      type: "setBoard";
      payload: OnlineBoardType;
    }
  | {
      type: "setMyPlayer";
      payload: Player;
    }
  | {
      type: "setOpponent";
      payload: Player;
    }
  | {
      type: "setOpponentClockInfo";
      payload: Date;
    }
  | {
      type: "setMyClockInfo";
      payload: Date;
    }
  | {
      type: "setGameFinished";
      payload: boolean;
    }
  | {
      type: "setGameStarted";
      payload: boolean;
    }
  | {
      type: "setSearchingGame";
      payload: boolean;
    }
  | {
      type: "setGameId";
      payload: number;
    }
  | {
      type: "setCurrentPosition";
      payload: number;
    }
  | {
      type: "reset";
      payload: null | {
        isRated: boolean;
        gameType: GameType;
      };
    }
  | {
      type: "playMove";
      payload: Move;
    }
  | {
      type: "playMoveAction";
      payload: Move;
    }
  | {
      type: "updateOpponentClockByMilliseconds";
      payload: number;
    }
  | {
      type: "updateMyClockByMilliseconds";
      payload: number;
    }
  | {
      type: "toggleGear";
      payload: null;
    }
  | {
      type: "setDataFromBoardResponse";
      payload: {
        boardResponse: BoardResponse;
      };
    }
  | {
      type: "setUpGame";
      payload: { chessGameResponse: ChessGameResponse; nameInGame: string };
    }
  | {
      type: "listenForFirstMove";
      payload: {
        boardResponse: BoardResponse;
        myPlayer: Player;
        opponent: Player;
      };
    };

export const getInitialState = (
  isRated: boolean,
  gameType: GameType
): PlayOnlineState => {
  return {
    board: getInitialOnlineBoard(isRated, gameType),
    myPlayer: getBasePlayer(),
    opponent: getBasePlayer(),
    gameFinished: false,
    gameStarted: false,
    searchingGame: false,
    gameId: -1,
    currentPosition: 0,
  };
};

export const initialState: PlayOnlineState = getInitialState(
  true,
  GameType.BLITZ
);

export function reducer(
  state: PlayOnlineState,
  action: PlayOnlineAction
): PlayOnlineState {
  switch (action.type) {
    case "setBoard":
      return { ...state, board: action.payload };
    case "setMyPlayer":
      return { ...state, myPlayer: action.payload };
    case "setOpponent":
      return { ...state, opponent: action.payload };
    case "setOpponentClockInfo":
      return {
        ...state,
        opponent: { ...state.opponent, timeLeft: action.payload },
      };
    case "setMyClockInfo":
      return {
        ...state,
        myPlayer: { ...state.myPlayer, timeLeft: action.payload },
      };
    case "setGameFinished":
      return { ...state, gameFinished: action.payload };
    case "setGameStarted":
      return { ...state, gameStarted: action.payload };
    case "setSearchingGame":
      return { ...state, searchingGame: action.payload };
    case "setGameId":
      return { ...state, gameId: action.payload };
    case "setCurrentPosition":
      return { ...state, currentPosition: action.payload };
    case "reset":
      return action.payload
        ? getInitialState(action.payload.isRated, action.payload.gameType)
        : initialState;
    case "playMove":
      return {
        ...state,
        board: { ...state.board, ...playMove(action.payload, state.board) },
        currentPosition: state.currentPosition + 1,
        gameStarted: true,
      };
    case "updateOpponentClockByMilliseconds":
      return {
        ...state,
        opponent: {
          ...state.opponent,
          timeLeft: new Date(
            state.opponent?.timeLeft!.getTime() + action.payload
          ),
        },
      };
    case "updateMyClockByMilliseconds":
      return {
        ...state,
        myPlayer: {
          ...state.myPlayer,
          timeLeft: new Date(
            state.myPlayer.timeLeft!.getTime() + action.payload
          ),
        },
      };
    case "setDataFromBoardResponse":
      return {
        ...state,
        board: BoardResponseToOnlineBoard(action.payload.boardResponse),
        myPlayer: {
          ...state.myPlayer,
          timeLeft: new Date(
            state.myPlayer?.color === "white"
              ? action.payload.boardResponse.whiteTime
              : action.payload.boardResponse.blackTime
          ),
        },
        opponent: {
          ...state.opponent,
          timeLeft: new Date(
            state.myPlayer?.color === "black"
              ? action.payload.boardResponse.whiteTime
              : action.payload.boardResponse.blackTime
          ),
        },
        currentPosition: action.payload.boardResponse.moves.length - 1,
      };
    case "setUpGame":
      const isMyPlayerWhite =
        action.payload.chessGameResponse.whiteUser.nameInGame ===
        action.payload.nameInGame;
      const myColor = isMyPlayerWhite ? "white" : "black";
      const opponentColor = isMyPlayerWhite ? "black" : "white";
      const chessGameResponse = action.payload.chessGameResponse;
      return {
        ...state,
        searchingGame: false,
        gameId: action.payload.chessGameResponse.id,
        opponent: {
          ...responseUserToPlayer(
            chessGameResponse[`${opponentColor}User`],
            opponentColor
          ),
          timeLeft: new Date(action.payload.chessGameResponse.timeControl),
        },
        myPlayer: {
          ...responseUserToPlayer(chessGameResponse[`${myColor}User`], myColor),
          timeLeft: new Date(chessGameResponse.timeControl),
        },
      };
    case "listenForFirstMove":
      return {
        ...state,
        board: BoardResponseToOnlineBoard(action.payload.boardResponse),
        myPlayer: {
          ...action.payload.myPlayer,
          timeLeft: new Date(
            state.myPlayer?.color === "white"
              ? action.payload.boardResponse.whiteTime
              : action.payload.boardResponse.blackTime
          ),
        },
        opponent: {
          ...action.payload.opponent,
          timeLeft: new Date(
            state.myPlayer?.color === "black"
              ? action.payload.boardResponse.whiteTime
              : action.payload.boardResponse.blackTime
          ),
        },
      };
    default:
      return state;
  }
}
