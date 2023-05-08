import { View, Text ,StyleSheet} from 'react-native'
import React from 'react'
import { ColorsPallet } from '../utils/Constants'
type Props = {
    text: String
}

export default function Heading({text}: Props) {
    console.log(text)
  return (
    <View style={styles.headingContainer}>
      <Text style={styles.text}>{text}</Text>
    </View>
  )
}

const styles= StyleSheet.create({
    headingContainer:{
        width: "100%",
        height: 50,
        lineHeight: 50,
        padding: 13,
      backgroundColor: ColorsPallet.dark,
      marginTop: 10,
      marginBottom: 10,
    },
    text:{
        fontSize: 20,
        color: "white",
        textAlign: "center"
    }
})