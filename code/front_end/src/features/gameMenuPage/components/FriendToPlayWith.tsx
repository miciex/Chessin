import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { User } from "../../../context/UserContext";
import { FontAwesome5 } from "@expo/vector-icons";

type Props = {
  friend: User;
};

export default function FriendToPlayWith({ friend }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.userImageContainer}>
        <FontAwesome5 name="user" size={72} color="black" />
      </View>
      <Text style={styles.textStyle}>{friend.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexBasis: "30%",
    justifyContent: "center",
    alignItems: "center",
    height: "40%",
  },
  userImageContainer: {},
  textStyle: {
    fontSize: 16,
    fontWeight: "700",
  },
});
