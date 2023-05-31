import { Modal, View, Pressable, StyleSheet, TextInput } from "react-native";
import React, { useState, useContext, useRef } from "react";
import { ColorsPallet } from "../../../utils/Constants";
import { Char, isChar } from "../../../utils/Types";
import { verifyCode } from "../../../utils/ServicesConstants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../Routing";
import BaseButton from "../../../components/BaseButton";
import { AuthenticationResponse } from "../../../utils/ServicesTypes";
import { VerificationType } from "../../../utils/ServicesTypes";
import { Entypo } from "@expo/vector-icons";
import { StackParamList } from "../../../utils/Constants";
import { setUserDataFromResponse } from "../../../services/userServices";

type Props = {
  hideModal: () => void;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    StackParamList,
    undefined
  >;
  email: string;
  loginUser: boolean;
};

const InputLength = 8;
export default function AuthCodeModal({
  hideModal,
  navigation,
  email,
  loginUser,
}: Props) {
  const [inputs, setInputs] = useState<Char[]>(new Array(InputLength));

  const itemElems = useRef<any>(new Array(InputLength));

  const submitCode = () => {
    fetch(verifyCode, {
      body: JSON.stringify({
        verificationCode: inputs.join(""),
        email: email,
        verificationType: VerificationType.AUTHENTICATE,
        oldPassword: "",
        newPassword: "",
      }),
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("200");
          return response.json();
        } else if (response.status === 400) {
          console.log("400");
          return response
            .json()
            .then((data) => {
              console.log(data);
              throw new Error(data);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .then((data) => {
        if (loginUser) setUserDataFromResponse(data, email);
        return;
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
          <Pressable onPress={hideModal}>
            <Entypo name="circle-with-cross" size={24} color="black" />
          </Pressable>
          <View style={styles.contentContainer}>
            <View style={styles.inputsContainer}>{InputsView}</View>
            <View style={styles.submitButtonContainer}>
              <BaseButton handlePress={submitCode} text="Submit" />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    width: "100%",
    flex: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  mainContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ColorsPallet.light,
  },
  modalContainer: {
    width: "80%",
    height: "60%",
    borderRadius: 16,
    backgroundColor: ColorsPallet.lighter,
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
