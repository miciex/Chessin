import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";

import { FontAwesome5 } from "@expo/vector-icons";
import { ColorsPallet } from "../../../utils/Constants";

type Props = {
  nick: string;
  rank: Number;
};

const EndedGame = (props: Props) => {
  return (
    <View style={styles.record}>
      {/* <Image source={}/> */}
      <Text style={styles.left}>
        {props.nick} {props.rank}
      </Text>
      <Text style={styles.right}>
        <FontAwesome5 name="chess-board" size={24} color="black" />
      </Text>
    </View>
  );
};
export default EndedGame;

const styles = StyleSheet.create({
  record: {
    backgroundColor: ColorsPallet.baseColor,
    width: "86%",
    height: 37,
    padding: 10,
    borderRadius: 4,
    flexDirection: "row",
    flexWrap: "wrap",
    textAlign: "center",
    textDecorationStyle: "none",
    margin: 8,
    display: "flex",
  },
  left: {
    width: "50%",
  },
  right: {
    width: "50%",
    textAlign: "right",
  },
});
