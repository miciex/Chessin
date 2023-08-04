import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../Routing";
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
