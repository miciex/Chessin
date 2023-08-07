import { View, Text } from "react-native";
import React from "react";

type Props = {
  textContent: String;
};

export default function BaseModal({ textContent }: Props) {
  return (
    <View>
      <Text>{textContent}</Text>
    </View>
  );
}
