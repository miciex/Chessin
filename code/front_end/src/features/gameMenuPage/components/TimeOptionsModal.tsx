import { View, StyleSheet, Modal, Text } from "react-native";
import React from "react";
import PlayOnlineBar from "./PlayOnlineBar";
import {
  GameLengthTypeContextType,
  LengthType,
} from "../context/GameLengthContext";
import BaseButton from "../../../components/BaseButton";
import { ColorsPallet } from "../../../utils/Constants";

const bulletGameLengths: Array<LengthType> = [
  {
    increment: 0,
    totalTime: 60,
    lengthType: GameLengthTypeContextType.BULLET,
  },
  {
    increment: 1,
    totalTime: 60,
    lengthType: GameLengthTypeContextType.BULLET,
  },
  {
    increment: 1,
    totalTime: 120,
    lengthType: GameLengthTypeContextType.BULLET,
  },
];

const blitzGameLengths: Array<LengthType> = [
  {
    increment: 0,
    totalTime: 180,
    lengthType: GameLengthTypeContextType.BLITZ,
  },
  {
    increment: 2,
    totalTime: 180,
    lengthType: GameLengthTypeContextType.BLITZ,
  },
  {
    increment: 0,
    totalTime: 300,
    lengthType: GameLengthTypeContextType.BLITZ,
  },
];

const rapidGameLengths: Array<LengthType> = [
  {
    increment: 0,
    totalTime: 600,
    lengthType: GameLengthTypeContextType.RAPID,
  },
  {
    increment: 10,
    totalTime: 600,
    lengthType: GameLengthTypeContextType.RAPID,
  },
  {
    increment: 15,
    totalTime: 900,
    lengthType: GameLengthTypeContextType.RAPID,
  },
];

const gameLengths: Array<Array<LengthType>> = [
  bulletGameLengths,
  blitzGameLengths,
  rapidGameLengths,
];

type Props = { handleCloseModal: () => void };

export default function TimeOptionsModal({ handleCloseModal }: Props) {
  const convertArraysToElements = (lengthTypesArray: Array<LengthType>) => (
    <View style={styles.playOnlineBarContainer}>
      <PlayOnlineBar
        elementsInfo={lengthTypesArray}
        gameLengthType={GameLengthTypeContextType.BULLET}
      />
    </View>
  );

  const content = gameLengths.map((val) => convertArraysToElements(val));

  return (
    <Modal>
      <View style={styles.container}>
        <View style={styles.modalHeader}>
          <Text style={styles.headerText}>Game tempo</Text>
        </View>
        <View style={styles.contentContainer}>{content}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    gap: 16,
  },
  playOnlineBarContainer: {
    width: "100%",
    flex: 1,
  },
  contentContainer: {
    flex: 7,
  },
  modalHeader: {
    flex: 1,
    backgroundColor: ColorsPallet.darker,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: ColorsPallet.lighter,
    fontSize: 36,
  },
});
