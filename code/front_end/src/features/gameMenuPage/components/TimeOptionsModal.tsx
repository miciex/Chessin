import { View, StyleSheet, Modal } from "react-native";
import React from "react";
import PlayOnlineBar from "./PlayOnlineBar";
import {
  GameLengthTypeContextType,
  LengthType,
} from "../context/GameLengthType";
import BaseButton from "../../../components/BaseButton";

const baseGameLengths: {
  [key in GameLengthTypeContextType]: Array<LengthType>;
} = {
  [GameLengthTypeContextType.BULLET]: [
    {
      increment: 0,
      totalTime: 60,
    },
    {
      increment: 1,
      totalTime: 60,
    },
    {
      increment: 1,
      totalTime: 120,
    },
  ],
  [GameLengthTypeContextType.BLITZ]: [
    {
      increment: 0,
      totalTime: 180,
    },
    {
      increment: 2,
      totalTime: 180,
    },
    {
      increment: 0,
      totalTime: 300,
    },
  ],
  [GameLengthTypeContextType.RAPID]: [
    {
      increment: 0,
      totalTime: 60,
    },
    {
      increment: 0,
      totalTime: 60,
    },
    {
      increment: 0,
      totalTime: 60,
    },
  ],
  [GameLengthTypeContextType.CUSTOM]: [
    {
      increment: 0,
      totalTime: 0,
    },
  ],
};

type Props = { handleCloseModal: () => void };

export default function TimeOptionsModal({ handleCloseModal }: Props) {
  return (
    <Modal>
      <View style={styles.container}>
        <View style={styles.playOnlineBarContainer}>
          <PlayOnlineBar
            elementsInfo={baseGameLengths.bullet}
            gameLengthType={GameLengthTypeContextType.BULLET}
          />
        </View>
        <View style={styles.playOnlineBarContainer}>
          <PlayOnlineBar
            elementsInfo={baseGameLengths.blitz}
            gameLengthType={GameLengthTypeContextType.BLITZ}
          />
        </View>
        <View style={styles.playOnlineBarContainer}>
          <PlayOnlineBar
            elementsInfo={baseGameLengths.rapid}
            gameLengthType={GameLengthTypeContextType.RAPID}
          />
        </View>
      </View>
      <BaseButton text="Close Modal" handlePress={handleCloseModal} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "50%",
    gap: 16,
  },
  playOnlineBarContainer: {
    width: "85%",
    flex: 1,
  },
});
