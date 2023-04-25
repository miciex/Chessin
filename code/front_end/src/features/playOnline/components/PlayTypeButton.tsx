import { Text, Pressable } from "react-native";
import React, { useState } from "react";
import type { playType } from "./PlayTypeButtons";
import BaseButton from "../../../components/BaseButton";

type Props = {
  text: playType;
  active: playType;
  handlePress: (gameType: playType) => void;
};

export default function PlayTypeButton({ text, active, handlePress }: Props) {
  return (
    <BaseButton
      text={text}
      handlePress={() => {
        handlePress(text);
      }}
    />
  );
}
