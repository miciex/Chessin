import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { Fontisto } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { ColorsPallet } from "../../../utils/Constants";

type Props = {
  nick: string;
  rank: Number;
  active: boolean;
  playing: boolean;
};

const Friend = (props: Props) => {
  const PlayingEye = () => {
    if (!props.playing) {
      return null;
    }
    return <FontAwesome5 name="eye" size={18} color="green" />;
  };
  const Online = () => {
    if (!props.active) {
      return <Fontisto name="radio-btn-active" size={9} color="black" />;
    }
    return <Fontisto name="radio-btn-active" size={9} color="green" />;
  };
  return (
    <View style={styles.record}>
      {/* <Image source={}/> */}
      <Text style={styles.left}>
        <Online /> {props.nick} {props.rank.toString()}
      </Text>

      <View style={styles.right}>
        <Text style={{ textAlign: "right", width: "100%" }}>
          <PlayingEye />
          {"  "}
          <FontAwesome5 name="chess-board" size={18} color="black" />
        </Text>
      </View>
    </View>
  );
};
export default Friend;

const styles = StyleSheet.create({
  record: {
    backgroundColor: ColorsPallet.baseColor,

    width: "100%",
    height: 60,
    padding: 20,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    textAlign: "center",
    textDecorationStyle: "none",
    marginBottom: 10,
    marginTop: 10,
    display: "flex",
  },
  left: {
    width: "70%",
    // backgroundColor: "red",
  },
  right: {
    width: "30%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
