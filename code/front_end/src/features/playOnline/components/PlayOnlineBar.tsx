import { View, StyleSheet } from "react-native";
import React from "react";
import { PlayOnlineState, PlayOnlineAction } from "../../../pages/PlayOnline";
import { FontAwesome } from "@expo/vector-icons";

type Props = {
  state: PlayOnlineState;
  dispatch: React.Dispatch<PlayOnlineAction>;
  toggleSettings: () => void;
};

export default function PlayOnlineBar({
  state,
  dispatch,
  toggleSettings,
}: Props) {
  return (
    <View style={styles.gameOptionsContainer}>
      <FontAwesome name="flag-o" size={34} color="black" onPress={() => {}} />
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
