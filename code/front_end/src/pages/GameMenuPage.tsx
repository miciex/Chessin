import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../Routing";
import Footer from "../components/Footer";
import { ColorsPallet } from "../utils/Constants";
import BottomButtons from "../features/gameMenuPage/components/BottomButtons";
import {
  TypeContext,
  playType,
} from "../features/gameMenuPage/context/TypeContext";
import {
  BotTypeContext,
  botType,
} from "../features/gameMenuPage/context/BotTypeContext";
import {
  strengthLevelType,
  botStrengthLevelContextType,
} from "../features/gameMenuPage/context/BotStrengthContext";
import BotGameOptions from "../features/gameMenuPage/components/BotGameOptions";
import {
  PlayColorsContextType,
  PlayColorsContext,
} from "../features/gameMenuPage/context/PlayColorContext";
import PickColor from "../features/gameMenuPage/components/PickColor";
import PlayOnlineOptions from "../features/gameMenuPage/components/PlayOnlineOptions";
import { User } from "../utils/PlayerUtilities";
import { getValueFor } from "../utils/AsyncStoreFunctions";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "GameMenu",
    undefined
  >;
  route: RouteProp<RootStackParamList, "GameMenu">;
};

export default function GameMenu({ route, navigation }: Props) {
  useEffect(() => {
    getValueFor("user").then((user) => {
      if (!user) return;
      setUser(JSON.parse(user));
    });
  }, []);

  const [gameType, setGameType] = useState<playType>("Play Online");
  const [gameBotType, setGameBotType] = useState<botType>("ChessinBot");
  const [gameBotStrength, setGameBotStrength] = useState<strengthLevelType>(1);
  const [chosenColor, setChosenColor] =
    useState<PlayColorsContextType>("random");
  const [user, setUser] = useState<User | null>(null);

  const setGame = (gmType: playType) => {
    setGameType(gmType);
  };

  const setBotType = (botType: botType) => {
    setGameBotType(botType);
  };

  const setColor = (colorType: PlayColorsContextType) => {
    setChosenColor(colorType);
  };
  return (
    <PlayColorsContext.Provider value={chosenColor}>
      <botStrengthLevelContextType.Provider value={gameBotStrength}>
        <BotTypeContext.Provider value={gameBotType}>
          <TypeContext.Provider value={gameType}>
            <View style={styles.appContainer}>
              <View style={styles.contentContainer}>
                <View style={styles.chooseGameContainer}>
                  {gameType === "Play With Bot" ? (
                    <>
                      <View style={styles.gameOptionsContainer}>
                        <BotGameOptions
                          setBotType={setBotType}
                          setGameBotStrength={setGameBotStrength}
                          handleChooseBotType={setBotType}
                          navigation={navigation}
                        />
                      </View>
                      <View style={styles.pickColorContainer}>
                        <View style={styles.pickColorInnerContainer}>
                          <PickColor handleOnClick={setChosenColor} />
                        </View>
                      </View>
                    </>
                  ) : (
                    <PlayOnlineOptions navigation={navigation} user={user} />
                  )}
                </View>
                <View style={styles.bottomButtonsContainer}>
                  <BottomButtons
                    navigation={navigation}
                    handleSetType={setGame}
                  />
                </View>
              </View>
              <Footer navigation={navigation} />
            </View>
          </TypeContext.Provider>
        </BotTypeContext.Provider>
      </botStrengthLevelContextType.Provider>
    </PlayColorsContext.Provider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignContent: "stretch",
    backgroundColor: ColorsPallet.light,
  },
  contentContainer: {
    flex: 8,
    alignItems: "center",
  },
  chooseGameContainer: {
    flex: 7,
    alignItems: "center",
    gap: 16,
  },
  bottomButtonsContainer: {
    flex: 2,
    width: "100%",
  },
  gameOptionsContainer: {
    width: "100%",
    flex: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  pickColorContainer: {
    width: "100%",
    flex: 1,
  },
  pickColorInnerContainer: {
    width: "50%",
    flexDirection: "row",
  },
});
