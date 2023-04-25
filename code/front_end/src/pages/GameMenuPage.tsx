import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../Routing";
import Footer from "../components/Footer";
import { ColorsPallet } from "../utils/Constants";
import BottonButtons from "../features/playOnline/components/BottomButtons";
import PlayTypeButton from "../features/playOnline/components/PlayTypeButton";
import PlayTypeButtons from "../features/playOnline/components/PlayTypeButtons";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "GameMenu",
    undefined
  >;
  route: RouteProp<RootStackParamList, "GameMenu">;
};

export default function GameMenu({ route, navigation }: Props) {
  return (
    <View style={styles.appContainer}>
      <View style={styles.contentContainer}>
        <BottonButtons />
      </View>
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
    flex: 8,
    alignItems: "center",
  },
});
