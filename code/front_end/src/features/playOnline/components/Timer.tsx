import { View, Text, StyleSheet } from "react-native";
import React from "react";

type Props = {
  info: Date | undefined;
};

export default function Timer({ info }: Props) {
  return (
    <View style={styles.appContainer}>
      <Text style={styles.appText}>
        {info
          ? info.getMinutes().toString() +
            ":" +
            (info.getSeconds().toString().length === 1
              ? "0" + info.getSeconds().toString()
              : info.getSeconds().toString())
          : null}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  appText: {
    fontSize: 20,
  },
});
