import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";

import EndedGame from "../features/home/components/EndedGame";
import { ColorsPallet } from "../utils/Constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import Submit from "../features/login/components/Submit";
import Footer from "../components/Footer";
import Heading from "../components/Heading";

const ended_games = [
  { date: "01.10.2022", playerNick: "Pusznik", rank: 1500, lastGameResult: "win" },
  { date: "01.10.2022", playerNick: "MaciekNieBij", rank: 1500, lastGameResult: "win" },
  { date: "01.10.2022", playerNick: "Slaweczuk", rank: 1500, lastGameResult: "win" },
  { date: "01.10.2022", playerNick: "Strzała", rank: 1500, lastGameResult: "lose" },
  { date: "01.10.2022", playerNick: "Bestia", rank: 1500, lastGameResult: "win" },
  { date: "01.10.2022", playerNick: "Sharku", rank: 1000, lastGameResult: "lose" },
  { date: "01.10.2022", playerNick: "Zocho", rank: 1300, lastGameResult: "draw" },
  { date: "01.10.2022", playerNick: "Zocho", rank: 1300, lastGameResult: "draw" },
  { date: "01.10.2022", playerNick: "Zocho", rank: 1300, lastGameResult: "draw" },
  { date: "01.10.2022", playerNick: "Zocho", rank: 1300, lastGameResult: "draw" },
];

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "LastGame",
    undefined
  >;
  route: RouteProp<RootStackParamList, "LastGame">;
};

export default function LastGame({ route, navigation }: Props) {
  return (
    <View style={styles.appContainer}>
      <ScrollView>
        <View style={styles.contentContainer}>
        <Heading text={"Old Games"}/>
          {ended_games.map((gracz) => (
            <EndedGame
              nick={gracz.playerNick}
              rank={gracz.rank}
              result={gracz.lastGameResult}
              date={gracz.date}
              navigation={navigation}
            />
          ))}
        </View>
      </ScrollView>
      <Footer navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignContent: "stretch",
    backgroundColor: ColorsPallet.light,
  },
  contentContainer: {
    marginTop: 32,
    flex: 8,
    alignItems: "center",
  },

  endedGames: {},
  endGame: {},
});
