import { Pressable, Text, StyleSheet } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../Routing";
import { ColorsPallet } from "../../../utils/Constants";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home", undefined>;
  text: "Login" | "Register";
};

export default function SingButton({ navigation, text }: Props) {
  const handlePress = () => {
    navigation.navigate(text);
  };

  return (
    <Pressable onPress={handlePress} style={styles.button}>
      <Text style={styles.buttonText}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "40%",
    backgroundColor: ColorsPallet.baseColor,
  },
  buttonText: {
    color: ColorsPallet.darker,
  },
});
