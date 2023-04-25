import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import PlayTypeButton from "./PlayTypeButton";

export type playType = "Play Online" | "Play With Bot";

export default function PlayTypeButtons() {
  const [active, setActive] = useState<playType>("Play Online");

  const handleTypeChange = (gameType: playType) => {
    setActive(gameType);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <PlayTypeButton
          text="Play Online"
          active={active}
          handlePress={handleTypeChange}
        ></PlayTypeButton>
      </View>
      <View style={styles.buttonContainer}>
        <PlayTypeButton
          text="Play With Bot"
          active={active}
          handlePress={handleTypeChange}
        ></PlayTypeButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  buttonContainer: {
    width: "40%",
    height: 32,
  },
});
