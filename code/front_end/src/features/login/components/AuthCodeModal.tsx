import {
  Modal,
  View,
  Pressable,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
} from "react-native";
import React, { useState, useRef } from "react";
import { ColorsPallet } from "../../../utils/Constants";
import { Char, isChar } from "../../../utils/Types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../Routing";
import BaseButton from "../../../components/BaseButton";
import { VerificationType } from "../../../utils/ServicesTypes";
import { Entypo } from "@expo/vector-icons";
import { StackParamList } from "../../../utils/Constants";
import { setUserDataFromResponse } from "../../../services/userServices";
import { verifyCode } from "../../../services/AuthenticationServices";
import { CodeVerificationRequest } from "../../../utils/ServicesTypes";
import { AuthenticationResponse } from "../../../utils/ServicesTypes";

type Props = {
  hideModal: () => void;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    StackParamList,
    undefined
  >;
  request: CodeVerificationRequest;
  handleVerifyCodeResponse?: (
    data: AuthenticationResponse,
    request: CodeVerificationRequest
  ) => void;
};

const InputLength = 8;
export default function AuthCodeModal({
  hideModal,
  navigation,
  request,
  handleVerifyCodeResponse,
}: Props) {
  const [inputs, setInputs] = useState<Char[]>(new Array(InputLength).fill(""));

  const itemElems = useRef<any>(new Array(InputLength));

  const submitCode = () => {
    verifyCode(request)
      .then((data) => {
        if (!handleVerifyCodeResponse) return;
        handleVerifyCodeResponse(data, {
          ...request,
          verificationCode: inputs.join(""),
        });
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

    if (text.length === 0) return;

    itemElems.current[index + 1]?.focus();
    itemElems.current[0].blur();
    if (index + 1 === InputLength) itemElems.current[index]?.blur();
  };

  const handleKeyPress = (
    nativeEvent: TextInputKeyPressEventData,
    index: number
  ) => {
    console.log(nativeEvent.key);
    if (nativeEvent.key === "Backspace" && index > 0 && inputs[index] === "") {
      itemElems.current[index - 1]?.focus();
      return;
    }
    if (
      nativeEvent.key === "Backspace" &&
      index === 0 &&
      inputs[index] === ""
    ) {
      itemElems.current[index].blur();
      return;
    }
    if (nativeEvent.key === " ") {
      if (itemElems.current[index + 1]) itemElems.current[index + 1].focus();
      else itemElems.current[index].blur();
    }
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
          onKeyPress={({ nativeEvent }) => {
            handleKeyPress(nativeEvent, i);
          }}
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
