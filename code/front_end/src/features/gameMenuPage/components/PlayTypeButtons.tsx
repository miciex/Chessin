import { View, StyleSheet } from "react-native";
import React, { useContext } from "react";
import PlayTypeButton from "./PlayTypeButton";
import { ColorsPallet } from "../../../utils/Constants";
import { TypeContext, playType } from "../context/TypeContext";

type Props = {
  handleSetType: (gameType: playType) => void;
};

export default function PlayTypeButtons({ handleSetType }: Props) {
  const active = useContext(TypeContext);

  return (
    <View style={styles.container}>
      <View
        style={
          active === "Play Online"
            ? { ...styles.activeButtonContainer }
            : { ...styles.unactiveButtonContainer }
        }
      >
        <View style={styles.buttonContainer}>
          <PlayTypeButton
            text="Play Online"
            handlePress={handleSetType}
          ></PlayTypeButton>
        </View>
      </View>
      <View
        style={
          active === "Play With Bot"
            ? { ...styles.activeButtonContainer }
            : { ...styles.unactiveButtonContainer }
        }
      >
        <View style={styles.buttonContainer}>
          <PlayTypeButton
            text="Play With Bot"
            handlePress={handleSetType}
          ></PlayTypeButton>
        </View>
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
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
    height: 32,
    backgroundColor: ColorsPallet.baseColor,
    borderRadius: 8,
  },
  unactiveButtonContainer: {
    width: "40%",
    height: 32,
    borderRadius: 8,
  },
  activeButtonContainer: {
    backgroundColor: ColorsPallet.darker,
    width: "40%",
    height: 40,
    padding: 4,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
