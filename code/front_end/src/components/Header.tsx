import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { ColorsPallet } from "../utils/Constants";
import { FontAwesome } from "@expo/vector-icons";

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Chessin</Text>
      <FontAwesome
        name="user-circle"
        size={32}
        color="black"
        style={styles.headerImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: "100%",
    backgroundColor: ColorsPallet.darker,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-end",
  },
  headerText: {
    fontSize: 32,
    fontWeight: "700",
    color: ColorsPallet.light,
  },
  headerImage: {
    marginBottom: 4,
  },
});
