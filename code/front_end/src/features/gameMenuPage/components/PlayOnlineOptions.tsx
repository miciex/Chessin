import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import TimeOptionsModal from "./TimeOptionsModal";
import BaseButton from "../../../components/BaseButton";
import BaseCustomContentButton from "../../../components/BaseCustomContentButton";

export default function PlayOnlineOptions() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [] = useState();

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <View style={styles.container}>
      {isModalOpen ? (
        <TimeOptionsModal handleCloseModal={handleCloseModal} />
      ) : (
        <View>
          <View style={styles.openModalButtonContainer}>
            <BaseCustomContentButton
              content={<View></View>}
              handlePress={handleOpenModal}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    gap: 16,
  },
  openModalButtonContainer: {
    flex: 1,
  },
});
