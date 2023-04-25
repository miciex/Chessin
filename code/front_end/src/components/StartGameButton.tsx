import { View, Text } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { StackParamList } from "../utils/Constants";
import BaseButton from "./BaseButton";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    StackParamList,
    undefined
  >;
};

export default function StartGameButton({ navigation }: Props) {
  const handlePress = () => {
    navigation.navigate("PlayOnline");
  };

  return <BaseButton handlePress={handlePress} text="Play" />;
}
