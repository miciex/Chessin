import { View, Text, StyleSheet } from "react-native";
import React from "react";
import CountryFlag from "react-native-country-flag";
import { Player } from "../../../utils/PlayerUtilities";
import { ColorsPallet } from "../../../utils/Constants";
import Timer from "./Timer";
import { FontAwesome } from "@expo/vector-icons";
import { countryToIsoCode } from "..";

type Props = {
  player: Player | null;
  timerInfo?: Date | undefined;
};

export default function PlayerBar({ player, timerInfo }: Props) {
  return (
    <View style={styles.appContainer}>
      <View style={styles.textContainer}>
        <FontAwesome name="user-circle" size={32} color="black" />
        <Text style={styles.text}>{player ? player.firstname : ""}</Text>
        <Text style={styles.text}>{player ? player.highestRanking : ""}</Text>
      </View>
      <View style={styles.iconsContainer}>
        <View style={styles.timerContainer}>
          <Timer info={timerInfo} />
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
    width: "100%",
    flexDirection: "row",
    padding: 8,
    backgroundColor: ColorsPallet.baseColor,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    height: "100%",
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
