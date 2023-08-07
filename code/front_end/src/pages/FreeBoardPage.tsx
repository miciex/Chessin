import { View, StyleSheet } from "react-native";
import React, { useReducer } from "react";
import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../Routing";
import { ColorsPallet } from "../utils/Constants";
import PiecesBar from "../features/free-board/components/PiecesBar";
import FunctionsBar from "../features/free-board/components/FunctionsBar";
import OnlineBoard from "../features/playOnline/components/Board";
import {
  reducer,
  initialState,
} from "../features/playOnline/reducers/PlayOnlineReducer";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "FreeBoard",
    undefined
  >;
  route: RouteProp<RootStackParamList, "FreeBoard">;
};

export default function FreeBoard({ navigation }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <View style={styles.appContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.mainContentContainer}>
          <PiecesBar barColor="white" />
          <View style={styles.boardContainer}>
            <OnlineBoard state={state} dispatch={dispatch} />
          </View>
          <PiecesBar barColor="black" />
          <FunctionsBar />
        </View>
      </View>
      <Footer navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignContent: "stretch",
    backgroundColor: ColorsPallet.lighter,
    paddingTop: 32,
  },
  contentContainer: {
    flex: 8,
    alignItems: "center",
  },
  boardContainer: {
    width: "100%",
    aspectRatio: 1,
  },
  gameRecordContainer: {
    width: "100%",
    height: 32,
  },
  mainContentContainer: {
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  analyzisContainer: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "stretch",
    rowGap: 4,
  },
  scrollView: {
    width: "100%",
    backgroundColor: ColorsPallet.darker,
  },
});
