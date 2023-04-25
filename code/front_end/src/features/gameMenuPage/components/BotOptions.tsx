import { View, StyleSheet } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";

export default function BotOptions() {
  return (
    <View style={styles.container}>
      <FontAwesome5 name="fish" size={24} color="black" />
      <FontAwesome5 name="robot" size={24} color="black" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 32,
    height: 72,
    alignItems: "center",
  },
});
