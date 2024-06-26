import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { ColorsPallet } from "../../../utils/Constants";
import BaseButton from "../../../components/BaseButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../Routing";
import { StackParamList } from "../../../utils/Constants";
import { GameResults } from "../../../chess-logic/board";
import {
  PlayOnlineState,
  PlayOnlineAction,
} from "../reducers/PlayOnlineReducer";
import { PendingChessGameRequest } from "../../../utils/ServicesTypes";
import { User } from "../../../utils/PlayerUtilities";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    StackParamList,
    undefined
  >;
  state: PlayOnlineState;
  dispatch: React.Dispatch<PlayOnlineAction>;
  searchGame: (user: User, request: PendingChessGameRequest) => void;
};
export default function GameFinishedOverlay({
  state,
  navigation,
  searchGame,
}: Props) {
  const getText = (): string => {
    switch (state.board.result) {
      case GameResults.DRAW_50_MOVE_RULE:
        return "Draw by 50 move rule";
      case GameResults.INSUFFICIENT_MATERIAL:
        return "Draw by insufficient material";
      case GameResults.STALEMATE:
        return "Draw by stalemate";
      case GameResults.THREE_FOLD:
        return "Draw by threefold repetition";
      case GameResults.DRAW_AGREEMENT:
        return "Draw by agreement";
      case GameResults.BLACK_RESIGN:
        return "Black resigned";
      case GameResults.WHITE_RESIGN:
        return "White resigned";
      case GameResults.WHITE_TIMEOUT:
        return "White lost on time";
      case GameResults.BLACK_TIMEOUT:
        return "Black lost on time";
      case GameResults.MATE:
        return state.board.whiteToMove
          ? "Black won by mate"
          : "White won by mate";
      case GameResults.ABANDONED:
        return "Game abandoned";
      case GameResults.BLACK_DISCONNECTED:
        return "Black disconnected";
      case GameResults.WHITE_DISCONNECTED:
        return "White disconnected";
      case GameResults.BLACK_ABANDONED:
        return "Black abandoned game";
      case GameResults.WHITE_ABANDONED:
        return "White abandoned game";
      default:
        return "Unknown result";
    }
  };

  const showOverlay =
    state.board.result !== GameResults.NONE && state.searchingGame === false;

  const winnerText = getText();

  const handlePlayAgain = () => {
    if (!state.myPlayer?.color) return;
    const userRating =
      state.myPlayer.ranking[state.board.gameType] + state.myPlayer.color ===
      "white"
        ? state.board.whiteRatingChange
        : state.board.blackRatingChange;
    const request: PendingChessGameRequest = {
      timeControl: state.timeControl,
      increment: state.increment,
      bottomRating: userRating - 200,
      topRating: userRating + 200,
      userRating,
      isRated: state.board.isRated,
      gameType: state.board.gameType,
      nameInGame: state.myPlayer.nameInGame,
    };

    searchGame(state.myPlayer, request);
  };

  return showOverlay ? (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Game finished</Text>
          <Text style={styles.winnerText}>{winnerText}</Text>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.buttonContainer}>
            <BaseButton text="Play again" handlePress={handlePlayAgain} />
            <BaseButton
              text="Go to Menu"
              handlePress={() => {
                navigation.navigate("GameMenu");
              }}
              color={ColorsPallet.baseColor}
            />
          </View>
        </View>
      </View>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
    height: "72.5%",
    position: "absolute",
    top: 50,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    backgroundColor: `${ColorsPallet.light}A0`,
    position: "absolute",
  },
  textContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    width: "50%",
    height: 32,
    gap: 16,
  },
  contentContainer: {
    flex: 2,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  winnerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
