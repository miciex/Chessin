import { View, StyleSheet, Modal, Text, Pressable } from "react-native";
import React from "react";
import PlayOnlineBar from "./PlayOnlineBar";
import {
  GameLengthTypeContextType,
  LengthType,
} from "../context/GameLengthContext";
import { ColorsPallet } from "../../../utils/Constants";
import { Entypo } from "@expo/vector-icons";

export const millis = 1000;

const bulletGameLengths: Array<LengthType> = [
  {
    increment: 0,
    totalTime: 60 * millis,
    lengthType: GameLengthTypeContextType.BULLET,
  },
  {
    increment: 1 * millis,
    totalTime: 60 * millis,
    lengthType: GameLengthTypeContextType.BULLET,
  },
  {
    increment: 1 * millis,
    totalTime: 120 * millis,
    lengthType: GameLengthTypeContextType.BULLET,
  },
];

const blitzGameLengths: Array<LengthType> = [
  {
    increment: 0,
    totalTime: 180 * millis,
    lengthType: GameLengthTypeContextType.BLITZ,
  },
  {
    increment: 2 * millis,
    totalTime: 180 * millis,
    lengthType: GameLengthTypeContextType.BLITZ,
  },
  {
    increment: 0,
    totalTime: 300 * millis,
    lengthType: GameLengthTypeContextType.BLITZ,
  },
];

const rapidGameLengths: Array<LengthType> = [
  {
    increment: 0,
    totalTime: 600 * millis,
    lengthType: GameLengthTypeContextType.RAPID,
  },
  {
    increment: 10 * millis,
    totalTime: 600 * millis,
    lengthType: GameLengthTypeContextType.RAPID,
  },
  {
    increment: 15 * millis,
    totalTime: 900 * millis,
    lengthType: GameLengthTypeContextType.RAPID,
  },
];

const gameLengths: Array<Array<LengthType>> = [
  bulletGameLengths,
  blitzGameLengths,
  rapidGameLengths,
];

type Props = {
  handleCloseModal: () => void;
  handleGameTempoChange: (tempo: LengthType) => void;
};

export default function TimeOptionsModal({
  handleCloseModal,
  handleGameTempoChange,
}: Props) {
  const convertArraysToElements = (lengthTypesArray: Array<LengthType>) => (
    <View style={styles.playOnlineBarContainer}>
      <PlayOnlineBar
        elementsInfo={lengthTypesArray}
        handleCloseModal={handleCloseModal}
        handleGameTempoChange={handleGameTempoChange}
      />
    </View>
  );

  const content = gameLengths.map((val) => convertArraysToElements(val));

  return (
    <Modal>
      <View style={styles.container}>
        <View style={styles.modalHeader}>
          <View style={styles.closeModalButtonContainer}>
            <View style={styles.closeModalButtonInnerContainer}>
              <Pressable
                style={styles.closeModalButton}
                android_ripple={{
                  color: ColorsPallet.lighter,
                  borderless: false,
                }}
                onPress={handleCloseModal}
              >
                <Entypo name="cross" size={36} color="black" />
              </Pressable>
            </View>
          </View>
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
    backgroundColor: ColorsPallet.light,
    gap: 16,
  },
  playOnlineBarContainer: {
    width: "100%",
  },
  contentContainer: {
    flex: 7,
    gap: 32,
  },
  modalHeader: {
    flex: 1,
    backgroundColor: ColorsPallet.darker,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  headerText: {
    color: ColorsPallet.lighter,
    fontSize: 36,
    position: "absolute",
  },
  closeModalButton: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  closeModalButtonContainer: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    paddingLeft: 16,
  },
  closeModalButtonInnerContainer: {
    borderRadius: 8,
    overflow: "hidden",
    width: 36,
    height: 36,
  },
});
