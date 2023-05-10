import { View, Text,StyleSheet,Image } from 'react-native'
import React from 'react'
import { ColorsPallet } from '../../../utils/Constants'

type Props = {
    nick: String;
    rank: Number;
    active?: boolean;
    playing?: boolean;
}

export default function Profile({nick, rank, active, playing}:Props) {
  return (
    <View style={styles.profile}>
      <View style={styles.left}>
      <Image
        style={styles.tinyLogo}
        source={{
          uri: 'https://us-tuna-sounds-images.voicemod.net/6f0b01c1-bf29-4157-a1f7-800327ea9323-1658162982836.jpg',
        }}
      />
       <Image
        style={styles.flag}
        source={{
          uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Flag_of_Poland.svg/1200px-Flag_of_Poland.svg.png',
        }}
      />
      </View>
      <View style={styles.right}>
        <Text style={[styles.text, styles.name]}>{nick}</Text>
        <Text style={[styles.text, styles.rank]}>Bullet {rank.toString()}</Text>
        <Text style={[styles.text, styles.rank]}>Rapid {rank.toString()}</Text>
        <Text style={[styles.text, styles.rank]}>Blitz {rank.toString()}</Text>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
    profile: {
        backgroundColor: ColorsPallet.baseColor,
        width: "100%",
       
        padding: 20,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 10,
        flexDirection: "row",
        flexWrap: "wrap",
        textAlign: "center",
        textDecorationStyle: "none",
        marginBottom: 10,
        marginTop: 10,
        display: "flex",
      },
      left: {
        width: "40%",
        // backgroundColor: "green",
        alignItems: "center"
      },
      right: {
        width: "60%",
        // backgroundColor: "red",
      },
      text:{
        textAlign: "center"
      },
      name:{
        fontSize: 30,
       
      },
      rank:{
        fontSize: 18,
        marginTop: 10
      },
      tinyLogo: {
        width: 85,
        height: 85,
        borderRadius: 50,
      },
      
      flag: {
        marginTop: 10,
        width: 80,
        height: 40,
        borderRadius: 4,
      },
})