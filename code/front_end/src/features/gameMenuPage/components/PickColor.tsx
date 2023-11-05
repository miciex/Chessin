import { View, StyleSheet } from "react-native";
import React, { useContext } from "react";
import BaseCustomContentButton from "../../../components/BaseCustomContentButton";
import {
  PlayColorsContextType,
  PlayColorsContext,
} from "../context/PlayColorContext";
import { FontAwesome5 } from "@expo/vector-icons";
import { ColorsPallet } from "../../../utils/Constants";

type Props = {
  handleOnClick: (colorType: PlayColorsContextType) => void;
};

const iconNames = ["chess-king", "random", "chess-king"];
const colors = ["white", "black", "black"];
const colorsContext = new Array<PlayColorsContextType>(
  "WHITE",
  "RANDOM",
  "BLACK"
);

export default function PickColor({ handleOnClick }: Props) {
  const playColorsContext = useContext(PlayColorsContext);

  const content = iconNames.map((item, index) => (
    <View
      style={{
        ...styles.buttonContainer,
        backgroundColor:
          playColorsContext === colorsContext[index]
            ? ColorsPallet.lighter
            : ColorsPallet.baseColor,
      }}
    >
      <BaseCustomContentButton
        content={<FontAwesome5 name={item} size={24} color={colors[index]} />}
        handlePress={() => handleOnClick(colorsContext[index])}
      />
    </View>
  ));

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    gap: 4,
  },
  buttonContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
});
