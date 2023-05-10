import { View, StyleSheet, Text } from "react-native";
import React from "react";
import PlayOnlineElement from "./PlayOnlineElement";
import {
  LengthType,
  GameLengthTypeContextType,
} from "../context/GameLengthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { gameLengthTypeContextTypeToIconName } from "../services/HelpFunctions";

type Props = {
  elementsInfo: Array<LengthType>;
  handleCloseModal: () => void;
  handleGameTempoChange: (tempo: LengthType) => void;
};

export default function PlayOnlineBar({
  elementsInfo,
  handleCloseModal,
  handleGameTempoChange,
}: Props) {
  const icon = gameLengthTypeContextTypeToIconName(elementsInfo[0]);

  const content = elementsInfo.map((elem, index) => (
    <View style={styles.contentInnerContainer}>
      <PlayOnlineElement
        lengthType={elem}
        handleCloseModal={handleCloseModal}
        handleGameTempoChange={handleGameTempoChange}
        key={index}
      />
    </View>
  ));

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text>{elementsInfo[0].lengthType.toString()}</Text>
        {icon}
      </View>
      <View style={styles.contentContainer}>{content}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    rowGap: 8,
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
    flexBasis: "28%",
    justifyContent: "space-evenly",
  },
  textContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
