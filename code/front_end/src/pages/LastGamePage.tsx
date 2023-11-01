import { View, StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import EndedGame from "../features/home/components/EndedGame";
import { ColorsPallet } from "../utils/Constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import Footer from "../components/Footer";
import Heading from "../components/Heading";
import { User } from "../utils/PlayerUtilities";
import { ChessGameResponse } from "../utils/ServicesTypes";
import { getValueFor } from "../utils/AsyncStoreFunctions";
import { getGameHistory } from "../services/chessGameService";
import BaseButton from "../components/BaseButton";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "LastGame",
    undefined
  >;
  route: RouteProp<RootStackParamList, "LastGame">;
};

export default function LastGame({ navigation }: Props) {
  const [user, setUser] = useState<User>();
  const [userGames, setUserGames] = useState<ChessGameResponse[]>([]);
  const [gamesPage, setGamesPage] = useState<number>(0);

  const updateGamesPage = () => {
    setGamesPage((prev) => prev + 1);
  };

  const handleGetMoreGames = () => {
    //...Try to load more old games. If the code succeeded call udpateGamesPage
  };

  useEffect(() => {
    getValueFor("user")
      .then((user) => {
        if (!user) return navigation.navigate("UserNotAuthenticated");
        let parsedUser: User = JSON.parse(user);
        if (!parsedUser) return navigation.navigate("UserNotAuthenticated");
        setUser(parsedUser);
        getGameHistory(parsedUser.nameInGame).then((response) => {
          console.log("Got response");
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

  return (
    <View style={styles.appContainer}>
      <ScrollView>
        <View style={styles.contentContainer}>
          <Heading text={"Game History"} />
          {userGames.map((game) => (
            <View style={{ width: "90%" }}>
              <EndedGame
                nick={
                  game.whiteUser.nameInGame === user?.nameInGame
                    ? game.blackUser.nameInGame
                    : game.whiteUser.nameInGame
                }
                rank={
                  game.whiteUser.nameInGame === user?.nameInGame
                    ? game.blackRating
                    : game.whiteRating
                }
                result={"win"}
                navigation={navigation}
                key={`${game.id}${user?.nameInGame}`}
                date={"2023.10.27"}
                gameId={game.id}
              />
            </View>
          ))}
          <View style={styles.buttonContainer}>
            <BaseButton
              text="Load more games"
              handlePress={() => {}}
              fontColor="black"
              color="transparent"
            />
          </View>
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
    marginTop: 12,
    flex: 8,
    alignItems: "center",
  },
  buttonContainer:{
    margin: 12,
    height: 32,
    width: '50%'
  },

  endedGames: {},
  endGame: {},
});
