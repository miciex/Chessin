import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";

import { ColorsPallet } from "../../../utils/Constants";

type Props = {
  brand: string;
};

const LogInWithOtherFirm = (props: Props) => {
  return (
    <View style={styles.DivParent}>
      <FontAwesome5 name={props.brand} size={24} color="black" />
    </View>
  );
};

export default LogInWithOtherFirm;

const styles = StyleSheet.create({
  DivParent: {
    borderColor: ColorsPallet.dark,
    padding: 10,
    margin: 10,
  },
});
