import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import { ColorsPallet } from "../utils/Constants";

type Arguments = {
  placeholder: string;
};

const InputField = (props: Arguments) => {
  const [inputText, setInputText] = React.useState("NIGER");

  return (
    <View style={styles.InputField}>
      <TextInput
        onChangeText={setInputText}
        placeholder={props.placeholder}
        style={{
          textAlign: "center",
          color: ColorsPallet.darker,
          fontSize: 20,
          lineHeight: 100,
        }}
      />
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  InputField: {
    backgroundColor: ColorsPallet.baseColor,
    width: "100%",
    height: 55,
    padding: 12,
    borderRadius: 14,
    textAlign: "center",
    textDecorationStyle: "none",
    margin: 8,
  },
});
