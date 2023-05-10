import { View, Text, StyleSheet } from "react-native";
import React from "react";
import CountryFlag from "react-native-country-flag";
import { ColorsPallet } from "../../../utils/Constants";
import { FontAwesome5 } from "@expo/vector-icons";
import { BotPlayer } from "../../playOnline";

type Props = {
  player: BotPlayer | null;
};

export default function BotBar({ player }: Props) {
  return (
    <View style={styles.appContainer}>
      <View style={styles.textContainer}>
        <FontAwesome5
          name={player ? player.user.iconName : "circle"}
          size={32}
          color="black"
        />
        <Text style={styles.text}>{player ? player.user.name : ""}</Text>
        <Text style={styles.text}>{player ? player.user.ranking : ""}</Text>
      </View>
      <View style={styles.iconsContainer}></View>
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
