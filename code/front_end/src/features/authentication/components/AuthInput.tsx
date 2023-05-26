import { View, TextInput, StyleSheet, Text } from "react-native";
import React from "react";
import { ColorsPallet } from "../../../utils/Constants";

type Props = {
  placeholder: string;
  onChange?: (text: string) => void;
  value?: string;
  securityTextEntry?: boolean;
  isValid?: boolean | null;
  notValidText?: string;
  onSubmitEditing?: () => void;
};

export default function AuthInput({
  placeholder,
  onChange,
  value,
  securityTextEntry,
  isValid,
  notValidText,
  onSubmitEditing,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.textInputContainer}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          style={styles.textInput}
          secureTextEntry={securityTextEntry}
          onSubmitEditing={onSubmitEditing}
        />
      </View>
      {isValid === false || isValid === null ? null : (
        <Text style={styles.authText}>{notValidText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 4,
  },
  authText: {
    fontSize: 16,
    height: 20,
    width: "100%",
    color: "red",
  },
  textInputContainer: {
    backgroundColor: ColorsPallet.baseColor,
    width: "100%",
    height: 60,
    padding: 12,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    textAlign: "center",
    color: "black",
    fontSize: 20,
    width: "100%",
    flex: 1,
  },
});
