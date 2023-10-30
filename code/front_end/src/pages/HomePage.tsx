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
import { ChessGameResponse } from "../utils/ServicesTypes";
import { getGameHistory } from "../services/chessGameService";

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
  setUserAuthenticated: ()=>void;
};

const HomePage = ({ navigation }: Props) => {
  const [user, setUser] = useState<User>();
  const [userGames, setUserGames] = useState<ChessGameResponse[]>([]);

  useEffect(() => {
    getValueFor("user")
      .then((user) => {
        if (!user) return navigation.navigate("UserNotAuthenticated");
        let parsedUser: User = JSON.parse(user);
        if (!parsedUser) return navigation.navigate("UserNotAuthenticated");
        setUser(parsedUser);
        console.log("User: " + parsedUser.nameInGame);
        getGameHistory(parsedUser.nameInGame).then((response) => {
          console.log("Got response")
          console.log(response.status);
          if (response.status === 200) {
            response
              .json()
              .then((data: ChessGameResponse[]) => {
                setUserGames(data);
              })
              .catch((error) => {
                console.error(error);
                throw new Error("Couldn't load game history");
              });
          } else throw new Error("Couldn't load game history");
        });
      })
      .catch((error) => {
        navigation.navigate("UserNotAuthenticated");
        throw new Error(error);
      });
  }, []);

  const [levelModal, setLevelModal] = useState(false);
  const [levelOfPlayer, setLevel] = useState(800);

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
                  setLevelModal(!levelModal);
                }}
                text="Choose Your Level"
              />
            </View>
            <TopButtons navigation={navigation} user={user} />
            <View style={styles.oldGamesButton}>
              <BaseButton
                handlePress={() => {
                  navigation.navigate("LastGame");
                }}
                text="Old Games"
              />
            </View>

            {userGames.map((game) => (
              <View style={{ width: "90%" }}>
                <EndedGame
                  nick={game.whiteUser.nameInGame === user?.nameInGame ? game.blackUser.nameInGame : game.whiteUser.nameInGame}
                  rank={game.whiteUser.nameInGame === user?.nameInGame ? game.blackRating : game.whiteRating}
                  result={"win"}
                  navigation={navigation}
                  key={`${game.id}${user?.nameInGame}`}
                  date={"2023.10.27"}
                  gameId={game.id}
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
