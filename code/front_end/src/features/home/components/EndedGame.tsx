import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";

import { FontAwesome5 } from "@expo/vector-icons";
import { ColorsPallet } from "../../../utils/Constants";
// import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap%27);
// import { useFonts, Inter_900Black } from "@expo-google-fonts/inter";
// import { Inter_400Regular, useFonts } from "@expo-google-fonts/inter";

type Props = {
  nick: string;
  rank: Number;
  result: string;
};

const EndedGame = (props: Props) => {
  let resultColor = "rgb(92, 6, 6)";
  if (props.result == "win") {
    resultColor = "rgb(31, 145, 46)";
  } else if (props.result == "draw") {
    resultColor = "rgb(54, 56, 55)";
  }
  return (
    <View style={styles.record}>
      {/* <Image source={}/> */}
      <Text style={styles.left}>
        {props.nick} {props.rank.toString()}
      </Text>
      <View style={styles.right}>
        <Text style={{ textAlign: "right", width: "100%" }}>
          <FontAwesome5 name="chess-board" size={18} color="black" />
          <Text> </Text>
          <FontAwesome5 name="crown" size={18} color={resultColor} />
        </Text>
      </View>
    </View>
  );
};
export default EndedGame;

const styles = StyleSheet.create({
  record: {
    backgroundColor: ColorsPallet.baseColor,
    width: "87%",
    height: 37,
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 35,
    paddingRight: 25,
    borderRadius: 4,
    flexDirection: "row",
    flexWrap: "wrap",
    textAlign: "center",
    textDecorationStyle: "none",
    margin: 8,
    display: "flex",
  },
  left: {
    width: "80%",
  },
  right: {
    width: "20%",
  },
});
