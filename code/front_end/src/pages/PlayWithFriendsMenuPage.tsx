import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";

import { ColorsPallet } from "../utils/Constants";
import SendInvitation from "../features/playOnline/components/SendInvitation";
import InputField from "../components/InputField";
import EndedGame from "../features/home/components/EndedGame";

const friends = [
  { playerNick: "Pusznik", rank: 1500, active: false, avatar: "" },
  { playerNick: "MaciekNieBij", rank: 1500, active: true, avatar: "" },
  { playerNick: "Slaweczuk", rank: 1500, active: true, avatar: "" },
  { playerNick: "Strzała", rank: 1500, active: false, avatar: "" },
  { playerNick: "Bestia", rank: 1500, active: false, avatar: "" },
  { playerNick: "Sharku", rank: 1000, active: true, avatar: "" },
  { playerNick: "Zocho", rank: 1300, active: false, avatar: "" },
];

export default function PlayWithFriendsMenu() {
  return (
    <ScrollView>
      <View style={styles.appContainer}>
        <View style={styles.formContainer}>
          <SendInvitation />
          <InputField placeholder="Search" />
          {friends.map((gracz) => (
            <EndedGame
              nick={gracz.playerNick}
              rank={gracz.rank}
              result={gracz.avatar}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 8,
    alignItems: "center",
    backgroundColor: ColorsPallet.light,
    width: "80%",
  },
  appContainer: {
    backgroundColor: ColorsPallet.light,
    flex: 1,
    alignContent: "stretch",
    alignItems: "center",
  },
});
