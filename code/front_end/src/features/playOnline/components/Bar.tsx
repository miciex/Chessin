import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { countryToIsoCode } from "..";
import CountryFlag from "react-native-country-flag";
import { ColorsPallet } from "../../../utils/Constants";
import PlayerTimer from "./PlayerTimer";
import {
  PlayOnlineAction,
  PlayOnlineState,
} from "../reducers/PlayOnlineReducer";
import Timer from "./Timer";

type Props = {
  state: PlayOnlineState;
  dispatch: React.Dispatch<PlayOnlineAction>;
  isMyPlayer: boolean;
};

export default function Bar({ state, dispatch, isMyPlayer }: Props) {
  console.log("myPlayer: ", state.myPlayer, ", opponent: ", state.opponent);
  const player = isMyPlayer ? state.myPlayer : state.opponent;

  return (
    <View style={styles.appContainer}>
      <View style={styles.textContainer}>
        <FontAwesome name="user-circle" size={32} color="black" />
        <Text style={styles.text}>{player ? player.firstname : ""}</Text>
        <Text style={styles.text}>{player ? player.highestRanking : ""}</Text>
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
    flex: 1,
  },
  iconsContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    height: "100%",
  },
});
