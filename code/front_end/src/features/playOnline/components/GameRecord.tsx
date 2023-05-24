import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import { ColorsPallet } from "../../../utils/Constants";
import GameRecordMove from "./GameRecordMove";

//TODO: change moves to array of Move type
type Props = {
  moves: string[];
};
export default function GameRecord({ moves }: Props) {
  //TODO: convert moves to string array
  const movesContent = moves.map((move, index) => (
    <GameRecordMove move={move} key={index} handlePress={() => {}} />
  ));

  return (
    <View style={styles.appContainer}>
      <ScrollView horizontal={true}>{movesContent}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: ColorsPallet.dark,
    justifyContent: "center",
  },
});
