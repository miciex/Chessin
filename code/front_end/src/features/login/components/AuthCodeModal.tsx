import { Modal, View, Text, StyleSheet, TextInput } from "react-native";
import React, { useState, useContext, useRef } from "react";
import { ColorsPallet } from "../../../utils/Constants";
import { Char, isChar } from "../../../utils/Types";
import { verifyCode } from "../../../utils/ServicesConstants";
import { UserContext } from "../../../context/UserContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../Routing";
import BaseButton from "../../../components/BaseButton";
import { AuthenticationResponse } from "../../../utils/ServicesTypes";

type Props = {
  hideModal: () => void;
  navigation: NativeStackNavigationProp<RootStackParamList, "Login", undefined>;
  setUserDataFromResponse: (responseData: AuthenticationResponse) => void;
};

const InputLength = 8;
export default function AuthCodeModal({
  hideModal,
  navigation,
  setUserDataFromResponse,
}: Props) {
  const [inputs, setInputs] = useState<Char[]>(new Array(InputLength));

  const itemElems = useRef<any>(new Array(InputLength));

  const user = useContext(UserContext);

  const submitCode = () => {
    fetch(verifyCode, {
      body: JSON.stringify({ authCode: inputs.join(), email: user.email }),
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 400) {
          response.json().then((data) => {
            hideModal();
            throw new Error(data);
          });
        }
      })
      .then((data) => {
        console.log(data);
        setUserDataFromResponse(data);
      })
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOnChange = (text: string, index: number) => {
    if (!isChar(text)) return;

    let newInputs = [...inputs];
    newInputs[index] = text;
    setInputs(newInputs);
    itemElems.current[index + 1]?.focus();
    itemElems.current[0].blur();
    if (index + 1 === InputLength) itemElems.current[index]?.blur();
  };

  const getInputsView = () => {
    const inputsArray = [];
    for (let i = 0; i < InputLength; i++) {
      inputsArray.push(
        <TextInput
          style={styles.input}
          maxLength={1}
          value={inputs[i]?.toString()}
          onChangeText={(text) => handleOnChange(text, i)}
          ref={(ref) => (itemElems.current[i] = ref)}
        />
      );
    }
    return inputsArray;
  };

  const InputsView = getInputsView();

  return (
    <Modal transparent={true} onTouchEnd={hideModal}>
      <View style={styles.mainContainer}>
        <View style={styles.modalContainer}>
          <View style={styles.inputsContainer}>{InputsView}</View>
          <View style={styles.submitButtonContainer}>
            <BaseButton handlePress={submitCode} text="Submit" />
          </View>
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
    gap: 16,
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
  submitButtonContainer: {
    width: "50%",
    height: 32,
  },
});
