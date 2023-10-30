import { View, StyleSheet, Modal, Text } from "react-native";
import React, { useState } from "react";
import {
  PlayOnlineAction,
  PlayOnlineState,
} from "../reducers/PlayOnlineReducer";
import { FontAwesome } from "@expo/vector-icons";
import BaseButton from "../../../components/BaseButton";
import ResignGameModal from "./ResignGameModal";
import { submitMove } from "../services/playOnlineService";
import { BoardResponse, SubmitMoveRequest } from "../../../utils/ServicesTypes";

type Props = {
  state: PlayOnlineState;
  dispatch: React.Dispatch<PlayOnlineAction>;
  toggleSettings: () => void;
  toggleRotateBoard: () => void;
};

export default function PlayOnlineBar({
  toggleSettings,
  toggleRotateBoard,
  state,
  dispatch,
}: Props) {
  const [showResign, setShowResign] = useState(false);

  const resign = () => {
    const request: SubmitMoveRequest = {
      gameId: state.gameId,
      movedPiece: 0,
      startField: -1,
      endField: -1,
      promotePiece: 0,
      doesResign: true,
    };
    submitMove(request)
      .then((boardResponse: BoardResponse) => {
        if (!boardResponse) return;
        dispatch({
          type: "setDataFromBoardResponse",
          payload: { boardResponse },
        });
      })
      .catch((err) => {
        throw new Error("Failed to resign");
      })
      .finally(() => {
        setShowResign(false);
      });
  };

  const toggleResign = () => {
    setShowResign((prev) => !prev);
  };

  const modalTxt =
    state.board.moves.length > 1
      ? "Are you sure you want to resign?"
      : "Are you sure you want to abort the game?";

  return (
    <View style={styles.gameOptionsContainer}>
      <ResignGameModal
        showModal={showResign}
        toggleModal={toggleResign}
        modalAction={resign}
        modalTxt={modalTxt}
      />
      {!showResign && (
        <>
          <FontAwesome
            name="flag-o"
            size={34}
            color="black"
            onPress={toggleResign}
          />
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
        </>
      )}
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
