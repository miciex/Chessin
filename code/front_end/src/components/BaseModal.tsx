import { View, Text } from "react-native";
import React from "react";

type Props = {
  textContent: String;
  displayProp: String;
};

export default function BaseModal({ textContent, displayProp }: Props) {
  return (
    <View>
      <Text>{textContent}</Text>
    </View>
  );
}
