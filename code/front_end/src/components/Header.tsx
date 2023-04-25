import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { ColorsPallet } from "../utils/Constants";
import { FontAwesome } from "@expo/vector-icons";

export default function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Chessin</Text>
        <FontAwesome
          name="user-circle"
          size={32}
          color="black"
          style={styles.headerImage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignContent: "stretch",
    backgroundColor: ColorsPallet.darker,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 32,
    fontWeight: "700",
    color: ColorsPallet.light,
  },
  headerImage: {
    marginBottom: 4,
  },
  contentContainer: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
