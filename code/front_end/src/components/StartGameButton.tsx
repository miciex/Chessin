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
  navigationRoute: "PlayOnline" | "PlayBot";
  params?: any;
};

export default function StartGameButton({
  navigation,
  navigationRoute,
  params,
}: Props) {
  const handlePress = () => {
    navigation.navigate(navigationRoute, params);
  };

  return <BaseButton handlePress={handlePress} text="Play" />;
}
