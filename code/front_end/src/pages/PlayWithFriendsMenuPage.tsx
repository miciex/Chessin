import { View, StyleSheet, Switch, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
{/* <FontAwesome5 name="medal" size={24} color="black" />; */}
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
import { User } from "../utils/PlayerUtilities";
import { getValueFor } from "../utils/AsyncStoreFunctions";
import { GameType } from "../chess-logic/board";
import { inviteToGame } from "../services/userServices";
import { ChessGameResponse } from "../utils/ServicesTypes";

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
    }).catch((error) => {
      throw new Error(error);
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
    totalTime: 5 * 1000 * 60,
    increment: 0,
  });
  const handleGameTempoChange = (tempo: LengthType) => {
    setGameTempo(tempo);
  };

  const [timerModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [isEnabled, setIsEnabled] = useState(true);

  const handlePressRanked = () => {
    setIsEnabled(!isEnabled);
  };
  return (
    
      <PlayColorsContext.Provider value={chosenColor}>
        <View style={styles.appContainer}>
          {timerModalOpen ? (
            <TimeOptionsModal
              handleCloseModal={handleCloseModal}
              handleGameTempoChange={handleGameTempoChange}
            />
          ) : (
            
            <View style={styles.contentContainer}>
              <ScrollView contentContainerStyle={{alignItems:"center", width:"90%"}}>
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
                  country={user2 ? user2.country : "Poland"}
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
                      let request = {
                        friendNickname: user2 ? user2.nameInGame : "",
                        timeControl: gameTempo.totalTime,
                        increment: gameTempo.increment,
                        isRated: isEnabled,
                        playerColor: chosenColor,
                      };

                      inviteToGame(request).then(
                        (response: null | ChessGameResponse) => {
                          if (!response) return;
                          navigation.replace("PlayOnline");
                        }
                      );
                    }}
                    text="Graj"
                    fontSizeProps={30}
                  />
                </View>
              </View>
              </ScrollView>
            </View>
          )}

          <Footer navigation={navigation} />
        </View>
      </PlayColorsContext.Provider>
    
  );
}

const styles = StyleSheet.create({
  appContainer: {
    backgroundColor: ColorsPallet.light,
    alignContent: 'center',
    alignItems: "center",
    flex: 1,
  },
  contentContainer: {
    marginTop: 22,
    flex: 7,
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
    // height: 200,
    alignItems: "center",
    marginBottom: 20,
    flex: 7
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
