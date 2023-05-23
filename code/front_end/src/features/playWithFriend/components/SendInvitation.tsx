import { View, Text, StyleSheet, Image, Pressable} from "react-native";
import React from "react";

import { ColorsPallet } from "../../../utils/Constants";

const SendInvitation = () => {
  return (
    <View style={{borderRadius: 10}}>
    <Pressable style={styles.button} android_ripple={{
      color: ColorsPallet.lighter,
      borderless: false,
    }}>
   
      <Text style={styles.text}>Send Invitation</Text>
   
    </Pressable>
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
