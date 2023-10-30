import { View, StyleSheet, Text } from "react-native";
import React from "react";
import { ColorsPallet } from "../utils/Constants";


export default function NotAuthenticatedHeader() {
  return (
    <View style={styles.header}>
        <Text style={styles.headerText}>Chessin</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 32,
    fontWeight: "700",
    color: ColorsPallet.light,
  },
});
