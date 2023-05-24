import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

import { ColorsPallet } from "../../../utils/Constants";

type Props = {
  onSubmit?: () => void;
};

const Submit = ({ onSubmit }: Props) => {
  return (
    <View style={styles.SubmitDiv}>
      <TouchableOpacity onPress={onSubmit}>
        <Text style={styles.Text}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Submit;

const styles = StyleSheet.create({
  SubmitDiv: {
    backgroundColor: ColorsPallet.baseColor,
    width: "45%",
    height: 40,
    padding: 10,
    borderRadius: 14,
    fontSize: 20,
    color: "#000000",
    textAlign: "center",
    textDecorationStyle: "none",
    margin: 15,
  },
  Text: {
    textAlign: "center",
    fontSize: 15,
  },
});
