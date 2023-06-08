import { View, StyleSheet } from "react-native";
import React from "react";
import { ColorsPallet } from "../../../utils/Constants";
import BaseButton from "../../../components/BaseButton";

type Props = {
  handlePress: () => void;
  move: string;
  currentPosition: number;
  id: number;
};

export default function GameRecordMove({
  handlePress,
  move,
  currentPosition,
  id,
}: Props) {
  return (
    <View style={styles.buttonContainer}>
      <BaseButton
        text={move}
        handlePress={() => {
          handlePress();
        }}
        color={
          id === currentPosition ? ColorsPallet.baseColor : ColorsPallet.dark
        }
        fontColor={ColorsPallet.lighter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: "100%",
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
