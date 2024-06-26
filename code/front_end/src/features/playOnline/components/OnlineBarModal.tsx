import { View, Text, StyleSheet } from "react-native";
import React from "react";
import BaseButton from "../../../components/BaseButton";
import { ColorsPallet } from "../../../utils/Constants";

type Props = {
  modalTxt: string;
  showModal: boolean;
  handleDecline: () => void;
  handleAccept: () => void;
};

export default function OnlineBarModal({
  modalTxt,
  showModal,
  handleDecline,
  handleAccept,
}: Props) {
  return showModal ? (
    <View style={styles.modal}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{modalTxt}</Text>
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonContainer}>
            <BaseButton
              text="Yes"
              handlePress={handleAccept}
              fontColor={ColorsPallet.green}
            />
          </View>
          <View style={styles.buttonContainer}>
            <BaseButton
              text="No"
              handlePress={handleDecline}
              fontColor={ColorsPallet.red}
            />
          </View>
        </View>
      </View>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  modal: {
    height: "60%",
    width: "75%",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  buttonContainer: {
    width: "20%",
  },
});
