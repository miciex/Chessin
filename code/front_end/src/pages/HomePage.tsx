import { View, StyleSheet, ScrollView } from "react-native";
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
import {
  BooleanMessageResponse,
  ChessGameResponse,
} from "../utils/ServicesTypes";
import { isUserPlaying } from "../services/chessGameService";
import { getPagedGames } from "../services/userServices";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home", undefined>;
  route: RouteProp<RootStackParamList, "Home">;
  setUserAuthenticated: () => void;
};

const HomePage = ({ navigation }: Props) => {
  const [user, setUser] = useState<User>();
  const [userGames, setUserGames] = useState<ChessGameResponse[]>([]);

  useEffect(() => {
    getValueFor("user")
      .then((user) => {
        console.log(user, " fuck");
        if (!user) return navigation.navigate("UserNotAuthenticated");
        let parsedUser: User = JSON.parse(user);
        if (!parsedUser) return navigation.navigate("UserNotAuthenticated");
        setUser(parsedUser);
        isUserPlaying(parsedUser.nameInGame)
          .then((data: BooleanMessageResponse) => {
            if (!data) return;
            if (data.message === "True") navigation.replace("PlayOnline");
          })
          .catch((err) => {
            throw new Error(err);
          });
        getPagedGames(parsedUser.nameInGame, 0)
          .then((data: ChessGameResponse[] | null) => {
            if (!data) return;
            setUserGames(data);
          })
          .catch((err) => {
            throw err;
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
          <View style={{ width: "100%", alignItems: "center" }}>
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
                  result={game.gameResult}
                  navigation={navigation}
                  key={game.id}
                  date={new Date(game.startTime)}
                  gameId={game.id}
                  myPlayerWhite={game.whiteUser.nameInGame === user?.nameInGame}
                  whiteToMove={
                    (game.whiteStarts && game.moves.length % 2 === 0) ||
                    (game.moves.length % 2 === 1 && !game.whiteStarts)
                  }
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
