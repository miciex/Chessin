import React, { useEffect } from 'react';
import { Modal, View, Animated, StyleSheet } from 'react-native';

type Props  = {
  visible: boolean;
  duration: number;
  onTimeout: () => void;
  text: String;
}

const InvitationModal = ({ visible, duration, onTimeout, text }: Props) => {
  useEffect(() => {
    let timeout: number;

    if (visible) {
      timeout = setTimeout(() => {
        onTimeout();
      }, duration);
    }

    return () => clearTimeout(timeout);
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.container}>
        <View style={styles.modal}>
          {text}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
});

export default InvitationModal;
