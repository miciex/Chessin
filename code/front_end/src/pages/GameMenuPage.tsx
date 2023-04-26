import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
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

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "GameMenu",
    undefined
  >;
  route: RouteProp<RootStackParamList, "GameMenu">;
};

export default function GameMenu({ route, navigation }: Props) {
  const [gameType, setGameType] = useState<playType>("Play Online");
  const [gameBotType, setGameBotType] = useState<botType>("ChessinBot");
  const [gameBotStrength, setGameBotStrength] = useState<strengthLevelType>(1);

  const setGame = (gmType: playType) => {
    setGameType(gmType);
  };

  const setBotType = (botType: botType) => {
    setGameBotType(botType);
  };

  return (
    <botStrengthLevelContextType.Provider value={gameBotStrength}>
      <BotTypeContext.Provider value={gameBotType}>
        <TypeContext.Provider value={gameType}>
          <View style={styles.appContainer}>
            <View style={styles.contentContainer}>
              <View style={styles.chooseGameContainer}>
                <BotGameOptions
                  setBotType={setBotType}
                  setGameBotStrength={setGameBotStrength}
                  handleChooseBotType={setBotType}
                />
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
  },
  bottomButtonsContainer: {
    flex: 2,
    width: "100%",
  },
});
