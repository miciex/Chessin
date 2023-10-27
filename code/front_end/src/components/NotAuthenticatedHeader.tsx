import { View, StyleSheet, Text } from "react-native";
import React from "react";
import { ColorsPallet } from "../utils/Constants";


export default function NotAuthenticatedHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Chessin</Text>
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
    width: "100%",
  },
  headerText: {
    fontSize: 32,
    fontWeight: "700",
    color: ColorsPallet.light,
    paddingLeft: "15%"
  },
  contentContainer: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
