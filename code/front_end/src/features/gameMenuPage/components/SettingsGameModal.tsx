import { View, Text, StyleSheet, Modal, Pressable } from 'react-native'
import React, {useState} from 'react'
import { ColorsPallet } from '../../../utils/Constants'

import { Entypo } from '@expo/vector-icons'

type Props = {
  toggleGear: Function;
  gearModalOn: boolean;
}

export default function SettingsGameModal({toggleGear}: Props) {


  

  return (
    <Modal  transparent={true}>
      <View style={{width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.6)"}}>
      <View style={styles.container}>
        <View style={styles.modalHeader}>
        <Text style={styles.headerText}>Settings</Text>
          <View style={styles.closeModalButtonContainer}>
            <View style={styles.closeModalButtonInnerContainer}>
              <Pressable
                style={styles.closeModalButton}
                android_ripple={{
                  color: ColorsPallet.lighter,
                  borderless: false,
                }}
                onPress={()=>{
                  toggleGear();
                }}
              >
                <Entypo name="cross" size={36} color="black" />
              </Pressable>
            </View>
          </View>
         
        </View>
        <View style={styles.contentContainer}></View>
      </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
    
  container: {
    width: "80%",
    height: "80%",
    backgroundColor: ColorsPallet.light,
    gap: 16,
    marginLeft: "10%",
    marginTop: "10%",
  },
  closeModalButton: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  closeModalButtonContainer: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    paddingLeft: 16,
  },
  closeModalButtonInnerContainer: {
    borderRadius: 8,
    overflow: "hidden",
    width: 36,
    height: 36,
  },
  modalHeader: {
    flex: 1,
    backgroundColor: ColorsPallet.darker,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  headerText: {
    color: ColorsPallet.lighter,
    fontSize: 36,
    position: "absolute",
  },
  contentContainer: {
    flex: 7,
    gap: 32,
  },
})