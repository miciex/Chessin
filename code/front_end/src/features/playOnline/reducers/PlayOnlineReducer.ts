import { Board, BoardResponseToBoard, playMove } from "../../../chess-logic/board";
import { Player, User, getBasePlayer, responseUserToPlayer } from "../../../utils/PlayerUtilities";
import { Move } from "../../../chess-logic/move";
import { getInitialChessBoard } from "..";
import { BoardResponse, ChessGameResponse } from "../../../utils/ServicesTypes";
import { cancelSearch } from "../services/playOnlineService";

export type PlayOnlineState = {
    board: Board;
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
        payload: Board;
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
        payload: null;
      }
    | {
        type: "playMove";
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
    |
      {
        type: "setDataFromBoardResponse";
        payload: {boardResponse: BoardResponse
            myPlayer: Player,
            opponent: Player
        };
      }|{
        type: "setTimeFromBoardResponse";
        payload: {boardResponse: BoardResponse,
            myPlayer: Player,
            opponent: Player}
      }|{
        type:"setUpGame";
        payload: {chessGameResponse: ChessGameResponse, user: User}
      }| {
        type: "listenForFirstMove";
        payload: {boardResponse: BoardResponse,
            myPlayer: Player,
            opponent: Player}
      };
  
export const initialState: PlayOnlineState = {
    board: getInitialChessBoard(),
    myPlayer: getBasePlayer(),
    opponent: getBasePlayer(),
    gameFinished: false,
    gameStarted: false,
    searchingGame: false,
    gameId: -1,
    currentPosition: 0,
  };
  
export  function reducer(
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
        return initialState;
      case "playMove":
        return { ...state, board: playMove(action.payload, state.board) };
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
        return {...state, board: BoardResponseToBoard(action.payload.boardResponse), myPlayer: action.payload.myPlayer, opponent: action.payload.opponent};
      case "setTimeFromBoardResponse":
            return {...state, myPlayer: {...state.myPlayer, timeLeft: new Date( state.myPlayer?.color === "white" ? action.payload.boardResponse.whiteTime :action.payload.boardResponse.blackTime)}, opponent: {...state.opponent, timeLeft: new Date( state.myPlayer?.color === "black" ? action.payload.boardResponse.whiteTime :action.payload.boardResponse.blackTime)}};
      case "setUpGame":
        if (action.payload.chessGameResponse.blackUser === null || action.payload.chessGameResponse.whiteUser === null) {
            cancelSearch().then(() => console.log("search cancelled")).catch((err) => console.log(err));
            return {...state, searchingGame: false, gameStarted: false, gameFinished: false, board: getInitialChessBoard(), myPlayer: getBasePlayer(), opponent: getBasePlayer(), gameId: -1, currentPosition: 0};
          }
          const isMyPlayerWhite = action.payload.chessGameResponse.whiteUser.nameInGame === action.payload.user.nameInGame
          const chessGameResponse = action.payload.chessGameResponse;
          return {...state, searchingGame: false,gameId: action.payload.chessGameResponse.id, opponent:  {...responseUserToPlayer(isMyPlayerWhite ? chessGameResponse.blackUser : chessGameResponse.whiteUser, isMyPlayerWhite ? "black":"white"), timeLeft: new Date(action.payload.chessGameResponse.timeControl)} , myPlayer:  {...responseUserToPlayer(isMyPlayerWhite ? chessGameResponse.whiteUser : chessGameResponse.blackUser, isMyPlayerWhite ? "white" : "black"), timeLeft: new Date(chessGameResponse.timeControl)}}; 
      case "listenForFirstMove":
          return {...state, board: BoardResponseToBoard(action.payload.boardResponse), myPlayer: {...action.payload.myPlayer,timeLeft: new Date( state.myPlayer?.color === "white" ? action.payload.boardResponse.whiteTime :action.payload.boardResponse.blackTime)}, opponent: {...action.payload.opponent, timeLeft: new Date( state.myPlayer?.color === "black" ? action.payload.boardResponse.whiteTime :action.payload.boardResponse.blackTime)}}
      default:
        return state;
    }
  }
  
