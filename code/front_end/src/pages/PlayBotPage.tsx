import { View, StyleSheet } from "react-native";
import React, { useReducer } from "react";
import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../Routing";
import PlayerBar from "../features/playOnline/components/PlayerBar";
import GameRecord from "../features/playOnline/components/GameRecord";
import { ColorsPallet } from "../utils/Constants";
import BotBar from "../features/play-with-bot/components/BotBar";
import {
  reducer,
  initialState,
} from "../features/play-with-bot/reducer/PlayWithBotReducer";
import OnlineBoard from "../features/playOnline/components/Board";
type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "PlayBot",
    undefined
  >;
  route: RouteProp<RootStackParamList, "PlayBot">;
};

export default function PlayBot({ navigation }: Props) {
  return (
    <View style={styles.appContainer}>
      <View style={styles.contentContainer}></View>
      <Footer navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignContent: "stretch",
    backgroundColor: ColorsPallet.lighter,
  },
  contentContainer: {
    flex: 8,
    alignItems: "center",
    gap: 16,
  },
  boardContainer: {
    width: "90%",
    aspectRatio: 1,
  },
  playerBarContainer: {
    width: "90%",
    height: 50,
  },
  gameRecordContainer: {
    width: "100%",
    height: 32,
  },
  mainContentContainer: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    gap: 16,
    justifyContent: "space-evenly",
  },
});
