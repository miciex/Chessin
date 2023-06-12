import { View, Text, StyleSheet, Modal, Pressable } from 'react-native'
import React, {useState} from 'react'
import { ColorsPallet } from '../../../utils/Constants'

import { Entypo } from '@expo/vector-icons'

type Props = {
  toggleGear: Function;
  gearModalOn: boolean;
}

export default function ChooseYourLevelModal({toggleGear}: Props) {


  const levels = ["Noob", "Intermediate", "Boss", "GothamChess","Wojtek Lvl"]

  return (
    <Modal  transparent={true}>
      <View style={{width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.6)"}}>
      <View style={styles.container}>
        <View style={styles.modalHeader}>
        <Text style={styles.headerText}>Choose Your Level</Text>
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
                <Entypo name="cross" size={40} color="black" />
              </Pressable>
            </View>
          </View>
         
        </View>
        <View style={styles.contentContainer} >
        {levels.map((level, index) => (
          <View style={styles.record}>
            <Pressable android_ripple={{
                color: ColorsPallet.darker,
                borderless: false,
              }} onPress={()=>{
                toggleGear();
              }} style={{width: "100%", height: "100%",  justifyContent: "center",alignItems: "center", borderRadius: 16}} >
                <Text style={{textAlign: "center", fontSize: 18}}>{level}</Text></Pressable></View>
          ))}
        </View>
      </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
    
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: ColorsPallet.light,
    gap: 16,
    marginTop: "40%",
    borderRadius: 16,
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
    borderRadius: 15,
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
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },
  headerText: {
    color: ColorsPallet.lighter,
    fontSize: 24,
    position: "absolute",
  },
  contentContainer: {
    flex: 7,
    gap: 32,
    alignItems: "center",
    marginTop: 15,
    borderRadius: 15,
  },
  record: {
    width: "80%",
    height: 70,
    overflow: "hidden",
    borderRadius: 8,
    flexDirection: "row",
    backgroundColor: ColorsPallet.baseColor
  }
})