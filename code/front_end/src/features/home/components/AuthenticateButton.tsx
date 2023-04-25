import { Pressable, Text, StyleSheet } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../Routing";
import { ColorsPallet } from "../../../utils/Constants";
import BaseButton from "../../../components/BaseButton";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home", undefined>;
  text: "Login" | "Register";
};

export default function SingButton({ navigation, text }: Props) {
  const handlePress = () => {
    navigation.navigate(text);
  };

  return <BaseButton handlePress={handlePress} text={text} />;
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
