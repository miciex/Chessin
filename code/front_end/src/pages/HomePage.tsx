import { View, StyleSheet, ScrollView, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { User } from "../utils/PlayerUtilities";
import { RootStackParamList } from "../../Routing";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import Footer from "../components/Footer";
import EndedGame from "../features/home/components/EndedGame";
import TopButtons from "../features/home/components/TopButtons";
import { ColorsPallet } from "../utils/Constants";
import BaseButton from "../components/BaseButton";
import { getValueFor } from "../utils/AsyncStoreFunctions";
import ChooseYourLevelModal from "../features/home/components/ChooseYourLevelModal";

//przykladowe stary gry
const ended_games = [
  {
    date: "01.10.2022",
    playerNick: "Pusznik",
    rank: 1500,
    lastGameResult: "win",
  },
  {
    date: "01.10.2022",
    playerNick: "MaciekNieBij",
    rank: 1500,
    lastGameResult: "win",
  },
  {
    date: "01.10.2022",
    playerNick: "Slaweczuk",
    rank: 1500,
    lastGameResult: "win",
  },
  {
    date: "01.10.2022",
    playerNick: "Strzała",
    rank: 1500,
    lastGameResult: "lose",
  },
  {
    date: "01.10.2022",
    playerNick: "Bestia",
    rank: 1500,
    lastGameResult: "win",
  },
  {
    date: "01.10.2022",
    playerNick: "Sharku",
    rank: 1000,
    lastGameResult: "lose",
  },
  {
    date: "01.10.2022",
    playerNick: "Zocho",
    rank: 1300,
    lastGameResult: "draw",
  },
  {
    date: "01.10.2022",
    playerNick: "Zocho",
    rank: 1300,
    lastGameResult: "draw",
  },
  {
    date: "01.10.2022",
    playerNick: "Zocho",
    rank: 1300,
    lastGameResult: "draw",
  },
  {
    date: "01.10.2022",
    playerNick: "Zocho",
    rank: 1300,
    lastGameResult: "draw",
  },
];

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home", undefined>;
  route: RouteProp<RootStackParamList, "Home">;
};

const HomePage = ({ navigation }: Props) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    getValueFor("user")
      .then((user) => {
        if (user) setUser(JSON.parse(user));
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, []);

  const [levelModal, setLevelModal] = useState(false);
  const [levelOfPlayer, setLevel] = useState(800)

  const toggleLevel = () => {
    setLevelModal(!levelModal);
    
  };

  return (
    <View style={styles.appContainer}>
      <View style={styles.contentContainer}>
        <ScrollView>
          
          
          {levelModal ? (
            <>
              <ChooseYourLevelModal
                toggleGear={toggleLevel}
                setLevel={setLevel}
              />
              {}
            </>
          ) : null}
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text>Your ELO Level: {levelOfPlayer}</Text>
          <View style={styles.oldGamesButton}>
              <BaseButton
                handlePress={() => {
                  setLevelModal(!levelModal)}
                }
                text="Choose Your Level"
              />
            </View>
            <TopButtons navigation={navigation} user={user}/>
            <View style={styles.oldGamesButton}>
              <BaseButton
                handlePress={() => {
                  navigation.navigate("LastGame");
                }}
                text="Old Games"
              />
            </View>


            {ended_games.map((gracz, index) => (
              <View style={{ width: "90%" }}>
                <EndedGame
                  nick={gracz.playerNick}
                  rank={gracz.rank}
                  result={gracz.lastGameResult}
                  navigation={navigation}
                  key={index}
                  date={gracz.date}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <Footer navigation={navigation} />
    </View>
  );
};

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
  oldGamesButton: {
    width: "80%",
    height: 55,
    margin: 10,
  },
});

export default HomePage;
