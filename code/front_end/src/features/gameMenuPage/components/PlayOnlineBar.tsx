import { View, StyleSheet, Text } from "react-native";
import React from "react";
import PlayOnlineElement from "./PlayOnlineElement";
import {
  LengthType,
  GameLengthTypeContextType,
} from "../context/GameLengthContext";

type Props = {
  elementsInfo: Array<LengthType>;
  gameLengthType: GameLengthTypeContextType;
};

export default function PlayOnlineBar({ elementsInfo, gameLengthType }: Props) {
  const content = elementsInfo.map((elem) => (
    <View style={styles.contentInnerContainer}>
      <PlayOnlineElement lengthType={elem} gameLengthType={gameLengthType} />
    </View>
  ));

  return (
    <View style={styles.container}>
      {/* <View>
        <Text>Blitz</Text>
      </View> */}
      <View style={styles.contentContainer}>{content}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 16,
  },
  contentContainer: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  contentInnerContainer: {
    height: 32,
    borderRadius: 8,
    overflow: "hidden",
    flexBasis: "30%",
    justifyContent: "space-evenly",
  },
});
