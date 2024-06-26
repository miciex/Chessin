import { View, StyleSheet } from "react-native";
import React from "react";
import PlayTypeButtons from "./PlayTypeButtons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../Routing";
import { StackParamList } from "../../../utils/Constants";
import { playType } from "../context/TypeContext";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    StackParamList,
    undefined
  >;
  handleSetType: (gameType: playType) => void;
};

export default function BottomButtons({ handleSetType }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.typeButtonsContainer}>
        <PlayTypeButtons handleSetType={handleSetType} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  startGameButtonInnerContainer: {
    width: "80%",
    height: 32,
  },
  startGameButtonOuterContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    height: 32,
    alignItems: "center",
  },
  typeButtonsContainer: {
    width: "100%",
    flex: 1,
  },
});
