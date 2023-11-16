import { View, StyleSheet, Text } from "react-native";
import React, { useState } from "react";
import {
  PlayOnlineAction,
  PlayOnlineState,
} from "../reducers/PlayOnlineReducer";
import { FontAwesome } from "@expo/vector-icons";
import OnlineBarModal from "./OnlineBarModal";
import { RespondToDrawOfferRequest } from "../../../utils/ServicesTypes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ResponseType } from "../../../utils/ServicesTypes";
import BaseButton from "../../../components/BaseButton";
import { GameResults } from "../../../chess-logic/board";

type Props = {
  state: PlayOnlineState;
  dispatch: React.Dispatch<PlayOnlineAction>;
  handleRespondToDrawOffer: (response: RespondToDrawOfferRequest) => void;
  handleSendDrawOffer: () => void;
  handleResign: (gameId: string) => void;
};

export default function PlayOnlineBar({
  state,
  dispatch,
  handleRespondToDrawOffer,
  handleSendDrawOffer,
  handleResign,
}: Props) {
  const [showResign, setShowResign] = useState(false);
  const [showOpponentDisconnected, setShowOpponentDisconnected] =
    useState(true);
  const [showOpponentReconnected, setShowOpponentReconnected] = useState(true);
  const toggleResign = () => {
    setShowResign((prev) => !prev);
  };

  const acceptDraw = () => {
    handleRespondToDrawOffer({
      gameId: state.gameId,
      responseType: ResponseType.ACCEPT,
    });
  };

  const declineDraw = () => {
    handleRespondToDrawOffer({
      gameId: state.gameId,
      responseType: ResponseType.DECLINE,
    });
  };

  const resign = () => {
    handleResign(String(state.gameId));
    setShowResign(false);
  };

  const modalTxt =
    state.board.moves.length > 1
      ? "Are you sure you want to resign?"
      : "Are you sure you want to abort the game?";

  const showOpponentDisconnectedInfo =
    showOpponentDisconnected &&
    state.opponentDisconnected &&
    state.board.result === GameResults.NONE;
  const showOpponentReconnectedInfo =
    showOpponentReconnected &&
    state.opponentReconnected &&
    state.board.result === GameResults.NONE;
  return (
    <View style={styles.gameOptionsContainer}>
      <OnlineBarModal
        showModal={
          showResign &&
          !state.opponentOfferedDraw &&
          !showOpponentDisconnectedInfo &&
          !showOpponentReconnectedInfo
        }
        handleDecline={toggleResign}
        handleAccept={resign}
        modalTxt={modalTxt}
      />
      <OnlineBarModal
        showModal={
          state.opponentOfferedDraw &&
          !showOpponentDisconnectedInfo &&
          !showOpponentReconnectedInfo
        }
        handleDecline={declineDraw}
        handleAccept={acceptDraw}
        modalTxt={"Your opponent offered a draw. Do you accept?"}
      />
      {!showResign &&
        !state.opponentOfferedDraw &&
        !showOpponentDisconnectedInfo &&
        !showOpponentReconnectedInfo && (
          <>
            <MaterialCommunityIcons
              name="fraction-one-half"
              size={34}
              color="black"
              onPress={handleSendDrawOffer}
            />
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
              onPress={() => {
                dispatch({ type: "toggleRotateBoard" });
              }}
            />
            <FontAwesome
              name="gear"
              size={34}
              color="black"
              onPress={() => {
                dispatch({ type: "toggleSettings" });
              }}
            />
          </>
        )}
      {showOpponentDisconnectedInfo && !showOpponentReconnectedInfo ? (
        <View>
          <View style={styles.closeButtonContainer}>
            <BaseButton
              text=""
              element={<FontAwesome name="close" size={24} color="black" />}
              handlePress={() => setShowOpponentDisconnected(false)}
            />
          </View>
          <Text style={{ color: "red" }}>Opponent disconnected</Text>
        </View>
      ) : null}
      {showOpponentReconnectedInfo ? (
        <View>
          <View style={styles.closeButtonContainer}>
            <BaseButton
              text=""
              element={<FontAwesome name="close" size={24} color="black" />}
              handlePress={() => setShowOpponentReconnected(false)}
            />
          </View>
          <Text style={{ color: "green" }}>Opponent reconnected</Text>
        </View>
      ) : null}
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
  closeButtonContainer: {
    position: "absolute",
    left: -20,
    top: -20,
    zIndex: 1,
    width: 24,
    height: 24,
  },
});
