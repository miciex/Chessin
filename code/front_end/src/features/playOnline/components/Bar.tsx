import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { countryToIsoCode } from "..";
import CountryFlag from "react-native-country-flag";
import { ColorsPallet } from "../../../utils/Constants";
import PlayerTimer from "./PlayerTimer";
import {
  PlayOnlineAction,
  PlayOnlineState,
} from "../reducers/PlayOnlineReducer";
import { GameResults } from "../../../chess-logic/board";
type Props = {
  state: PlayOnlineState;
  dispatch: React.Dispatch<PlayOnlineAction>;
  rotateBoard: boolean;
};

export default function Bar({ state, dispatch, rotateBoard }: Props) {
  const isMyPlayer = (!rotateBoard && state.myPlayer.color === "white" || rotateBoard && state.myPlayer.color === "black")
  const player = isMyPlayer ? state.myPlayer : state.opponent;
  const isPlayerWhite = player.color === "white";
  const ratingChange = Math.round(
    state.board[isPlayerWhite ? "whiteRatingChange" : "blackRatingChange"]
  );
  const rating = Math.round(
    state.board[isPlayerWhite ? "whiteRating" : "blackRating"]
  );

  const getRatingChangeColor = () => {
    if (ratingChange > 0) return "green";
    if (ratingChange < 0) return "red";
    return "gray";
  };

  return (
    <View style={styles.appContainer}>
      <View style={styles.textContainer}>
        <FontAwesome name="user-circle" size={32} color="black" />
        <Text style={styles.text}>{player ? player.firstname : ""}</Text>
        <View style={styles.eloContainer}>
          <Text style={styles.text}>{rating}</Text>
          {state.board.result !== GameResults.NONE && (
            <>
              {ratingChange < 0 ? (
                <Entypo name="minus" size={24} />
              ) : (
                <Entypo name="plus" size={24} />
              )}
              <Text style={[styles.text, styles[getRatingChangeColor()]]}>
                {Math.abs(ratingChange)}
              </Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.iconsContainer}>
        <View style={styles.timerContainer}>
          <PlayerTimer
            isMyPlayer={isMyPlayer}
            state={state}
            dispatch={dispatch}
          />
        </View>
        <CountryFlag
          isoCode={countryToIsoCode(player ? player.country : "")}
          size={24}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    width: "90%",
    flexDirection: "row",
    padding: 8,
    backgroundColor: ColorsPallet.baseColor,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    height: 48,
    gap: 8,
  },
  text: {
    fontSize: 20,
    fontWeight: "500",
  },
  textContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  timerContainer: {
    height: "100%",
  },
  iconsContainer: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    height: "100%",
  },
  green: {
    color: ColorsPallet.green,
  },
  gray: {
    color: ColorsPallet.gray,
  },
  red: {
    color: ColorsPallet.red,
  },
  eloContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
