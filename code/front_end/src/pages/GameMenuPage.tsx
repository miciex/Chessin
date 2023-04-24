import { View, Text } from "react-native";
import React from "react";
import { RootStackParamList } from "../../Routing";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "GameMenu">;

export default function GameMenu({ route, navigation }: Props) {
  return (
    <View>
      <Text>GameMenu</Text>
    </View>
  );
}
