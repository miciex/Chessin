import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";

import EndedGame from "../features/home/components/EndedGame";
import { ColorsPallet } from "../utils/Constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import Submit from "../features/login/components/Submit";
import Footer from "../components/Footer";

const ended_games = [
  { playerNick: "Pusznik", rank: 1500, lastGameResult: "win" },
  { playerNick: "MaciekNieBij", rank: 1500, lastGameResult: "win" },
  { playerNick: "Slaweczuk", rank: 1500, lastGameResult: "win" },
  { playerNick: "Strzała", rank: 1500, lastGameResult: "lose" },
  { playerNick: "Bestia", rank: 1500, lastGameResult: "win" },
  { playerNick: "Sharku", rank: 1000, lastGameResult: "lose" },
  { playerNick: "Zocho", rank: 1300, lastGameResult: "draw" },
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
          <Text style={{ fontSize: 18 }}>Old Games</Text>
          {ended_games.map((gracz) => (
            <EndedGame
              nick={gracz.playerNick}
              rank={gracz.rank}
              result={gracz.lastGameResult}
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
