import { BotPlayer, getBaseBotPlayer } from "../../playOnline";
import { Board } from "../../../chess-logic/board";
import { Player, getBasePlayer } from "../../../utils/PlayerUtilities";
import { getInitialChessBoard } from "../../playOnline";

export type PlayWithBotState = {
  board: Board;
  myPlayer: Player;
  opponent: BotPlayer;
  gameFinished: boolean;
  gameStarted: boolean;
  searchingGame: boolean;
  gameId: number;
  currentPosition: number;
};
export const initialState: PlayWithBotState = {
  board: getInitialChessBoard(),
  myPlayer: getBasePlayer(),
  opponent: getBaseBotPlayer(),
  gameFinished: false,
  gameStarted: false,
  searchingGame: false,
  gameId: 0,
  currentPosition: 0,
};

export type PlayWithBotAction = { type: "update"; payload: PlayWithBotState };

export const reducer = (
  state: PlayWithBotState,
  action: PlayWithBotAction
): PlayWithBotState => {
  switch (action.type) {
    case "update":
      return action.payload;
    default:
      return state;
  }
};
