import { View, StyleSheet } from "react-native";
import React from "react";
import {
  Entypo,
  Foundation,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function FunctionsBar() {
  return (
    <View style={styles.functionsBarContainer}>
      <Entypo name="magnifying-glass" size={32} color="black" />
      <Foundation name="loop" size={32} color="black" />
      <MaterialCommunityIcons name="sword-cross" size={32} color="black" />
      <FontAwesome name="repeat" size={32} color="black" />
      <Ionicons name="trash-bin-outline" size={32} color="black" />
    </View>
  );
}

const styles = StyleSheet.create({
  functionsBarContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    height: 48,
    alignItems: "center",
  },
});
