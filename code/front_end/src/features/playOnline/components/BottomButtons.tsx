import { View, StyleSheet } from "react-native";
import React from "react";
import PlayTypeButtons from "./PlayTypeButtons";
import PlayButton from "../../home/components/PlayButton";
import StartGameButton from "../../../components/StartGameButton";

export default function BottomButtons() {
  return (
    <View style={styles.container}>
      <PlayTypeButtons />
      <StartGameButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 2,
  },
});
