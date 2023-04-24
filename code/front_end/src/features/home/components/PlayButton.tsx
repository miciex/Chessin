import { Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../Routing";
import { ColorsPallet } from "../../../utils/Constants";
import BaseButton from "../../../components/BaseButton";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home", undefined>;
};

export default function PlayButton({ navigation }: Props) {
  const handlePress = () => {
    navigation.navigate("GameMenu");
  };

  return <BaseButton handlePress={handlePress} text="Play" />;
}
