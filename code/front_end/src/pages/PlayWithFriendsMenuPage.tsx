import { View, StyleSheet, Switch } from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
<FontAwesome5 name="medal" size={24} color="black" />;
import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import Profile from "../features/playWithFriend/components/Profile";
import { ColorsPallet } from "../utils/Constants";
import PickColor from "../features/gameMenuPage/components/PickColor";
import BaseButton from "../components/BaseButton";
import { PlayColorsContextType } from "../features/gameMenuPage/context/PlayColorContext";
import BaseCustomContentButton from "../components/BaseCustomContentButton";
import { PlayColorsContext } from "../features/gameMenuPage/context/PlayColorContext";
import ChooseTimeButton from "../features/gameMenuPage/components/ChooseTimeButton";
import { GameLengthTypeContext } from "../features/gameMenuPage/context/GameLengthContext";
import { LengthType } from "../features/gameMenuPage/context/GameLengthContext";
import TimeOptionsModal from "../features/gameMenuPage/components/TimeOptionsModal";
import { User, getRanking } from "../utils/PlayerUtilities";
import { getValueFor } from "../utils/AsyncStoreFunctions";
import { GameType } from "../chess-logic/board";
import { setPendingGameRequest } from "../features/playOnline/services/playOnlineService";
import { inviteToGameLink } from "../utils/ApiEndpoints";
import { inviteToGame } from "../services/userServices";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "PlayWithFriendsMenu",
    undefined
  >;
  route: RouteProp<RootStackParamList, "PlayWithFriendsMenu">;
};

export default function PlayWithFriendsMenuPage({ navigation, route }: Props) {
  const [user, setUser] = useState<User>();

  const user2 = route.params.userArg;

  useEffect(() => {
    getValueFor("user").then((user) => {
      if (user === null) return;
      setUser(JSON.parse(user));
    });
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [chosenColor, setChosenColor] =
    useState<PlayColorsContextType>("RANDOM");
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const [gameTempo, setGameTempo] = useState<LengthType>({
    gameType: GameType.BLITZ,
    totalTime: 5000,
    increment: 0,
  });
  const handleGameTempoChange = (tempo: LengthType) => {
    setGameTempo(tempo);
  };

  const [timerModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [isEnabled, setIsEnabled] = useState(true);

  const handlePressRanked = () => {
    setIsEnabled(!isEnabled);
    console.log(isEnabled, " cjik");
  };
  return (
    <View style={{ width: "100%", height: "100%" }}>
      <PlayColorsContext.Provider value={chosenColor}>
        <View style={styles.appContainer}>
          {timerModalOpen ? (
            <TimeOptionsModal
              handleCloseModal={handleCloseModal}
              handleGameTempoChange={handleGameTempoChange}
            />
          ) : (
            <View style={styles.contentContainer}>
              <View style={styles.profileBox}>
                <Profile
                  nick={user2 ? user2.nameInGame : ""}
                  rank={
                    user2
                      ? user2.ranking
                      : {
                          BULLET: 0,
                          BLITZ: 0,
                          RAPID: 0,
                          CLASSICAL: 0,
                        }
                  }
                  country={user2 ? user2.country : "POland"}
                />
                <View style={{ width: 400, height: 130 }}>
                  <ChooseTimeButton
                    handleOpenModal={handleOpenModal}
                    tempo={gameTempo}
                  />
                </View>

                <View style={styles.pickColor}>
                  <PickColor handleOnClick={setChosenColor} />
                </View>
                <View style={styles.rightButtons}>
                  <View style={styles.medalButton}>
                    <BaseCustomContentButton
                      handlePress={() => {
                        setIsEnabled(!isEnabled);
                      }}
                      content={
                        <FontAwesome5
                          name="medal"
                          size={44}
                          color={() => {
                            if (isEnabled) return "white";
                            else if (!isEnabled) return "black";
                          }}
                        />
                      }
                    />
                  </View>
                  <Switch
                    style={styles.switch}
                    trackColor={{ false: "grey", true: "orange" }}
                    thumbColor={"#f4f3f4"}
                    ios_backgroundColor={"grey"}
                    value={isEnabled}
                    onTouchMove={() => {
                      handlePressRanked();
                    }}
                  />
                </View>

                <View style={{ width: "80%", height: 80 }}>
                  <BaseButton
                    handlePress={() => {
                      if (!user) return;
                      console.log(isEnabled, " wartosc isRated");
                      let request = {
                        friendNickname: user2 ? user2.nameInGame : "",
                        timeControl: gameTempo.totalTime,
                        increment: gameTempo.increment,
                        isRated: isEnabled,
                        playerColor: chosenColor,
                      };

                      console.log(typeof isEnabled, "typ zmiennej");

                      inviteToGame(request);
                      navigation.navigate("PlayOnline");
                    }}
                    text="Graj"
                    fontSizeProps={30}
                  />
                </View>
              </View>
            </View>
          )}

          <Footer navigation={navigation} />
        </View>
      </PlayColorsContext.Provider>
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
    marginTop: 22,
    flex: 8,
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    fontSize: 24,
    lineHeight: 36,
  },
  buttonsContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },
  switch: {
    marginLeft: 30,
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
  rightButtons: {
    marginTop: 30,
    marginBottom: 30,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  profileBox: {
    width: "90%",
    height: 200,
    alignItems: "center",
    marginBottom: 20,
  },
  medalButton: {
    width: 60,
    height: 60,
    backgroundColor: ColorsPallet.baseColor,
    padding: 5,
    borderRadius: 8,
    transform: [{ scaleX: 1.15 }, { scaleY: 1.15 }],
  },
  pickColor: {
    width: 200,
    height: 60,
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
});
