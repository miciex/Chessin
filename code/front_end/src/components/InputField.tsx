import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import { ColorsPallet } from "../utils/Constants";

type Arguments = {
  placeholder: string;
  onChange?: (text: string) => void;
  value?: string;
};

const InputField = ({ placeholder, onChange, value }: Arguments) => {
  return (
    <View style={styles.InputField}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        style={{
          textAlign: "center",
          color: "black",
          fontSize: 20,
          width: "100%",
          flex: 1,
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
    height: 60,
    padding: 12,
    borderRadius: 14,
    margin: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
