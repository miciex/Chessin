import { View, TextInput, StyleSheet, Text, ScrollView } from "react-native";
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
  onFocus?: () => void;
  activeInput?: string
};

export default function AuthInput({
  placeholder,
  onChange,
  value,
  securityTextEntry,
  isValid,
  notValidText,
  onSubmitEditing,
  onFocus,
  activeInput
}: Props) {
  return (activeInput === undefined || activeInput === "" || activeInput === placeholder) ? (
    <View
      style={
        isValid === false ? styles.inValidContainer : styles.validContainer
      }
    >
      <View style={styles.textInputContainer}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          style={styles.textInput}
          secureTextEntry={securityTextEntry}
          onSubmitEditing={onSubmitEditing}
          onFocus={onFocus}
        />
      </View>
      {isValid === false ? (
        <ScrollView horizontal={true}>
          <Text style={styles.authText}>{notValidText}</Text>
        </ScrollView>
      ) : null}
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  validContainer: {
    width: "100%",
    gap: 4,
    height: 60,
  },
  inValidContainer: {
    height: 90,
    width: "100%",
    gap: 4,
  },
  authText: {
    fontSize: 16,
    height: 25,
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
