import { Modal, View, Text, StyleSheet, TextInput } from "react-native";
import React, { useState } from "react";
import { ColorsPallet } from "../../../utils/Constants";
import { Char, isChar } from "../../../utils/Types";
import { ElementType } from "react";

type Props = {
  hideModal: () => void;
};

const InputLength = 8;
export default function AuthCodeModal({ hideModal }: Props) {
  const [authCode, setAuthCode] = useState<Char[]>(new Array(InputLength));
  const [currentInput, setCurrentInput] = useState<number>(0);
  const [inputs, setInputs] = useState<Char[]>(new Array(InputLength));

  const getInputsView = () => {
    const inputsArray = [];
    for (let i = 0; i < InputLength; i++) {
      inputsArray.push(
        <TextInput
          style={styles.input}
          maxLength={1}
          value={inputs[i]?.toString()}
          onChangeText={(text) => {
            if (!isChar(text)) return;
            let newInputs = [...inputs];
            newInputs[i] = text;
            setInputs(newInputs);
          }}
        />
      );
    }
    return inputsArray;
  };

  const InputsView = getInputsView();

  return (
    <Modal transparent={true}>
      <View style={styles.mainContainer}>
        <View style={styles.modalContainer}>
          <View style={styles.inputsContainer}>{InputsView}</View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    width: "80%",
    height: "60%",
    borderRadius: 16,
    backgroundColor: ColorsPallet.lighter,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    flex: 1,
    textAlign: "center",
  },
  inputsContainer: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-around",
    gap: 8,
  },
});
