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

  const setGame = (gmType: playType) => {
    setGameType(gmType);
  };

  return (
    <TypeContext.Provider value={gameType}>
      <View style={styles.appContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.chooseGameContainer}>
            <BotGameOptions />
          </View>
          <View style={styles.bottomButtonsContainer}>
            <BottomButtons navigation={navigation} handleSetType={setGame} />
          </View>
        </View>
        <Footer navigation={navigation} />
      </View>
    </TypeContext.Provider>
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
