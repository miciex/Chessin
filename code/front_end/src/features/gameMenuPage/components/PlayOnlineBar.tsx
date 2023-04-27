import { View, StyleSheet } from "react-native";
import React from "react";
import PlayOnlineElement from "./PlayOnlineElement";
import {
  LengthType,
  GameLengthTypeContextType,
} from "../context/GameLengthType";

type Props = {
  elementsInfo: Array<LengthType>;
  gameLengthType: GameLengthTypeContextType;
};

export default function PlayOnlineBar({ elementsInfo, gameLengthType }: Props) {
  const content = elementsInfo.map((elem) => (
    <View style={styles.contentContainer}>
      <View style={styles.contentInnerContainer}>
        <PlayOnlineElement lengthType={elem} gameLengthType={gameLengthType} />
      </View>
    </View>
  ));

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    flexDirection: "row",
    width: "100%",
    gap: 16,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    height: "100%",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  contentInnerContainer: {
    height: 32,
    borderRadius: 8,
    overflow: "hidden",
  },
});
