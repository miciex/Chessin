import { View, StyleSheet } from "react-native";
import React from "react";
import {
  PlayOnlineAction,
  PlayOnlineState,
} from "../reducers/PlayOnlineReducer";
import { FontAwesome } from "@expo/vector-icons";

type Props = {
  state: PlayOnlineState;
  dispatch: React.Dispatch<PlayOnlineAction>;
  toggleSettings: () => void;
  toggleRotateBoard: () => void;
};

export default function PlayOnlineBar({
  toggleSettings,
  toggleRotateBoard,
}: Props) {
  return (
    <View style={styles.gameOptionsContainer}>
      <FontAwesome name="flag-o" size={34} color="black" onPress={() => {}} />
      <FontAwesome
        name="retweet"
        size={24}
        color="black"
        onPress={toggleRotateBoard}
      />
      <FontAwesome
        name="gear"
        size={34}
        color="black"
        onPress={toggleSettings}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  gameOptionsContainer: {
    width: "100%",
    flexDirection: "row",
    height: 48,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
