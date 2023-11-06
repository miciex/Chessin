import {
  BoardResponseToOnlineBoard,
  GameResults,
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
import { Move, moveResponseToMove } from "../../../chess-logic/move";
import { BoardResponse, ChessGameResponse } from "../../../utils/ServicesTypes";
import { ResponseUser } from "../../../utils/PlayerUtilities";
import { FenToIntArray, boardToMap } from "../../../chess-logic/helpMethods";

export type AnalyzeGameState = {
  id: number;
  whitePlayer: Player;
  blackPlayer: Player;
  moves: Array<Move>;
  availableCastles: Array<number>;
  positions: Array<{ [key: number]: number }>;
  timeControl: number;
  increment: number;
  startBoard: string;
  whiteStarts: boolean;
  gameType: GameType;
  whiteRating: number;
  blackRating: number;
  whiteRatinChange: number;
  blackRatingChange: number;
  isRated: boolean;
  currentPosition: number;
  gameResult: GameResults
};

const chessGameResponseToAnalyzeGameState = (
  chessGameResponse: ChessGameResponse
): AnalyzeGameState => {
  return {
    id: chessGameResponse.id,
    whitePlayer: responseUserToPlayer(chessGameResponse.whiteUser, "white"),
    blackPlayer: responseUserToPlayer(chessGameResponse.blackUser, "black"),
    moves: chessGameResponse.moves.map((move) => moveResponseToMove(move)),
    availableCastles: chessGameResponse.availableCastles,
    positions: [boardToMap(FenToIntArray(chessGameResponse.startBoard, 64)),...chessGameResponse.moves.map((move) => move.position)],
    timeControl: chessGameResponse.timeControl,
    increment: chessGameResponse.increment,
    startBoard: chessGameResponse.startBoard,
    whiteStarts: chessGameResponse.whiteStarts,
    gameType: chessGameResponse.gameType,
    whiteRating: chessGameResponse.whiteRating,
    blackRating: chessGameResponse.blackRating,
    whiteRatinChange: chessGameResponse.whiteRatinChange,
    blackRatingChange: chessGameResponse.blackRatingChange,
    isRated: chessGameResponse.isRated,
    currentPosition: 0,
    gameResult: chessGameResponse.gameResult
  };
};

export type AnalyzeGameAction =
  | {
      type: "setWhitePlayer";
      payload: Player;
    }
  | {
      type: "setBlackPlayer";
      payload: Player;
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
      type: "setDataFromChessGameResponse";
      payload:  ChessGameResponse;
    }
  | {
      type: "setUpGame";
      payload: { chessGameResponse: ChessGameResponse; nameInGame: string };
    }|{
      type: "setNextPosition";
    }|{
      type: "setPreviousPosition";
    };

export const getInitialState = (
  isRated: boolean,
  gameType: GameType
): AnalyzeGameState => {
  return {
    id: 0,
    whitePlayer: getBasePlayer(),
    blackPlayer: getBasePlayer(),
    moves: [],
    positions: [],
    availableCastles: [],
    timeControl: 0,
    increment: 0,
    startBoard: "",
    whiteStarts: true,
    gameType,
    whiteRating: 0,
    blackRating: 0,
    whiteRatinChange: 0,
    blackRatingChange: 0,
    isRated,
    currentPosition: 0,
    gameResult: GameResults.NONE
  };
};

export const initialState: AnalyzeGameState = getInitialState(
  true,
  GameType.BLITZ
);

export function reducer(
  state: AnalyzeGameState,
  action: AnalyzeGameAction
): AnalyzeGameState {
  switch (action.type) {
    case "setWhitePlayer":
      return { ...state, whitePlayer: action.payload };
    case "setBlackPlayer":
      return { ...state, blackPlayer: action.payload };
    case "setGameId":
      return { ...state, id: action.payload };
    case "setCurrentPosition":
      return { ...state, currentPosition: action.payload };
    case "reset":
      return action.payload
        ? getInitialState(action.payload.isRated, action.payload.gameType)
        : initialState;
    case "setDataFromChessGameResponse":
      return {
        ...chessGameResponseToAnalyzeGameState(
          action.payload
        ),
      };
    case "setNextPosition":
      if (state.currentPosition < state.moves.length - 1) {
        return { ...state, currentPosition: state.currentPosition + 1 };
      }
    case "setPreviousPosition":
      if (state.currentPosition > 0) {
        return { ...state, currentPosition: state.currentPosition - 1 };
      }
    default:
      return state;
  }
}
