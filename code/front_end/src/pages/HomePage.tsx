import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import React from "react";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import Footer from "../components/Footer";
import AuthenticateButton from "../features/home/components/AuthenticateButton";
import EndedGame from "../features/home/components/EndedGame";
import TopButtons from "../features/home/components/TopButtons";

//przykladowe stary gry
const ended_games = [
  { playerNick: "Pusznik", rank: 1500 },
  { playerNick: "MaciekNieBij", rank: 1500 },
  { playerNick: "Slaweczuk", rank: 1500 },
  { playerNick: "Strzała", rank: 1500 },
  { playerNick: "Bestia", rank: 1500 },
];

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home", undefined>;
  route: RouteProp<RootStackParamList, "Home">;
};

const HomePage = ({ route, navigation }: Props) => {
  const handleMove = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.appContainer}>
      <ScrollView>
        <View style={styles.contentContainer}>
          <TopButtons />
          <Text style={{ fontSize: 18 }}>Old Games</Text>
          {ended_games.map((gracz) => (
            <EndedGame nick={gracz.playerNick} rank={gracz.rank} />
          ))}
          <View style={styles.endedGames}>{}</View>
        </View>
      </ScrollView>
      <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignContent: "stretch",
  },
  contentContainer: {
    marginTop: 100,
    flex: 8,
    alignItems: "center",
  },

  endedGames: {},
  endGame: {},
});

export default HomePage;
