import { View, Text, StyleSheet, Image, Pressable} from "react-native";
import React, {useState} from "react";

import { ColorsPallet } from "../../../utils/Constants";
import InvitationModal from "./InvitationModal";
import { addFriendFunc } from "../../../services/userServices";

type Props = {
  nick: string;
}

const SendInvitation = ({nick}: Props) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleModalTimeout = () => {
    setModalVisible(false);
  };

  const handleAddFriend = ( ) => {
    addFriendFunc({friendNickname: nick}).then((data)=>{
      console.log(data)
    }).catch(err => {throw new Error(err)})
  }
  return (
    <View style={styles.buttonContainer}>
    <Pressable style={styles.button} android_ripple={{
      color: ColorsPallet.darker,
      borderless: false,
    }} onPress={()=>{handleAddFriend}}>
   <InvitationModal
        visible={modalVisible}
        duration={2000} // Display for 2 seconds
        onTimeout={handleModalTimeout}
        text="Wysłano Invite"
      />
      <Text style={styles.text}>Send Invitation</Text>
   
    </Pressable>
    </View>
  );
};

export default SendInvitation;

const styles = StyleSheet.create({
  button: {
    backgroundColor: ColorsPallet.baseColor,
    width: "100%",
    height: 55,
    paddingTop:13,
    borderRadius: 11,
    flexDirection: "row",
    flexWrap: "wrap",
    display: "flex",
    textDecorationStyle: "none",
  },
  text: {
    textAlign: "center",
    width: "100%",
    lineHeight: 28,
    fontSize: 18,
  },
  buttonContainer:{
    borderRadius: 10, marginBottom: 12, marginTop: 12,
    width: "100%",
    overflow: "hidden",
    flexDirection: "row",
  }
});
