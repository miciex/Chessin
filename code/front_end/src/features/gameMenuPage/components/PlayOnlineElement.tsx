import { View, Text, StyleSheet } from "react-native";
import React from "react";
import BaseCustomContentButton from "../../../components/BaseCustomContentButton";
import {
  LengthType,
  GameLengthTypeContextType,
} from "../context/GameLengthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ColorsPallet } from "../../../utils/Constants";

type Props = {
  lengthType: LengthType;
  gameLengthType: GameLengthTypeContextType;
};

export default function PlayOnlineElement({
  lengthType,
  gameLengthType,
}: Props) {
  const gameLengthTypeContextTypeToIconName = () => {
    switch (gameLengthType) {
      case GameLengthTypeContextType.BULLET:
        return <MaterialCommunityIcons name="bullet" size={24} color="black" />;
      case GameLengthTypeContextType.BLITZ:
        return (
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={24}
            color="rgb(235, 203, 47)"
          />
        );
      case GameLengthTypeContextType.RAPID:
        return (
          <MaterialCommunityIcons
            name="clock-time-eight"
            size={24}
            color="black"
          />
        );
      default:
        return (
          <MaterialCommunityIcons name="clock-edit" size={24} color="black" />
        );
    }
  };

  const createElementText = () => {
    return (
      (lengthType.totalTime < 60
        ? lengthType.totalTime
        : lengthType.totalTime / 60
      ).toString() +
      (lengthType.increment > 0 ? "+" + lengthType.increment.toString() : "")
    );
  };

  const icon = gameLengthTypeContextTypeToIconName();

  const elementText = createElementText();

  return (
    <View style={styles.container}>
      <BaseCustomContentButton
        content={
          <View style={styles.buttonContentContainer}>
            <Text>{elementText}</Text>
            {icon}
          </View>
        }
        handlePress={() => console.log("hello")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContentContainer: {
    flexDirection: "row",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: ColorsPallet.dark,
    width: "100%",
    height: "100%",
  },
});
