import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";

import { FontAwesome5 } from "@expo/vector-icons";
import { ColorsPallet } from "../../../utils/Constants";

type Props = {
  nick: string;
  rank: Number;
  result: string;
};

const EndedGame = (props: Props) => {
  let resultColor = "red";
  if (props.result == "win") {
    resultColor = "green";
  } else if (props.result == "draw") {
    resultColor = "gray";
  }
  return (
    <View style={styles.record}>
      {/* <Image source={}/> */}
      <Text style={styles.left}>
        {props.nick} {props.rank.toString()}
      </Text>
      <View style={styles.right}>
        <Text style={{ textAlign: "right", width: "100%" }}>
          <FontAwesome5
            style={styles.icon}
            name="chess-board"
            size={18}
            color="black"
          />

          <FontAwesome5
            style={styles.icon}
            name="crown"
            size={18}
            color={resultColor}
          />
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
    // textAlign: "right",
    // translateY: -10,
    // transform: "translate"
  },
  icon: { margin: 10 },
  space: {
    width: "",
  },
});
