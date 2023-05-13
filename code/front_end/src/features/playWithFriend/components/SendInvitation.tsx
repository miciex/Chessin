import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";

import { ColorsPallet } from "../../../utils/Constants";

const SendInvitation = () => {
  return (
    <View style={styles.button}>
      <Text style={styles.text}>Send Invitation</Text>
    </View>
  );
};

export default SendInvitation;

const styles = StyleSheet.create({
  button: {
    backgroundColor: ColorsPallet.baseColor,
    width: "100%",
    height: 55,
    paddingTop:13,
    borderRadius: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    display: "flex",
    textDecorationStyle: "none",
  },
  text: {
    textAlign: "center",
    width: "100%",
    lineHeight: 28,
    fontSize: 18,
  },
});
