import { Pressable, Text } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../../Routing";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home", undefined>;
  text: "Login" | "Register";
};

export default function SingButton({ navigation, text }: Props) {
  const onPress = () => {
    navigation.navigate(text);
  };

  return (
    <Pressable>
      <Text>{text}</Text>
    </Pressable>
  );
}
