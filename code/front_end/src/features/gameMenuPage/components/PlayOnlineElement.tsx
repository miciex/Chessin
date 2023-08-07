import { View, Text, StyleSheet } from "react-native";
import React from "react";
import BaseCustomContentButton from "../../../components/BaseCustomContentButton";
import { LengthType } from "../context/GameLengthContext";
import { ColorsPallet } from "../../../utils/Constants";
import { lengthTypeToText } from "../services/HelpFunctions";

type Props = {
  lengthType: LengthType;
  handleCloseModal: () => void;
  handleGameTempoChange: (tempo: LengthType) => void;
};

export default function PlayOnlineElement({
  lengthType,
  handleCloseModal,
  handleGameTempoChange,
}: Props) {
  const handleOnClick = () => {
    handleGameTempoChange(lengthType);
    handleCloseModal();
  };

  const elementText = lengthTypeToText(lengthType);

  return (
    <View style={styles.container}>
      <BaseCustomContentButton
        content={
          <View style={styles.buttonContentContainer}>
            <Text>{elementText}</Text>
          </View>
        }
        handlePress={handleOnClick}
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
