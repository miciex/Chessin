import { View, Text ,Image, StyleSheet} from 'react-native'
import React from 'react'

//powinien byc jakis dostep do baxy danych ktory mi da id i avatar najlepszych friends jako objecty

const bestFriends = [
    {playerNick: "Pusznik", avatar: "https://p.kindpng.com/picc/s/697-6978240_south-park-png-cartman-south-park-png-transparent.png"},
    {playerNick: "MaciekNieBij" , avatar: "https://p.kindpng.com/picc/s/697-6978240_south-park-png-cartman-south-park-png-transparent.png"},
    {playerNick: "Slaweczuk", avatar: "https://p.kindpng.com/picc/s/697-6978240_south-park-png-cartman-south-park-png-transparent.png" },
    {playerNick: "Strzała", avatar: "https://p.kindpng.com/picc/s/697-6978240_south-park-png-cartman-south-park-png-transparent.png" },
    {playerNick: "Bestia", avatar: "https://p.kindpng.com/picc/s/697-6978240_south-park-png-cartman-south-park-png-transparent.png" },
    {playerNick: "Sharku", avatar: "https://p.kindpng.com/picc/s/697-6978240_south-park-png-cartman-south-park-png-transparent.png"},
]

export default function FriendsIconList() {
  return (
    <View>
      <Text>FriendsIconList</Text>
      <View style={styles.imageContainer}>
        {bestFriends.map((player)=>{
            // return <Image source={{
            //     uri: "https://p.kindpng.com/picc/s/697-6978240_south-park-png-cartman-south-park-png-transparent.png",
            //   }}/>
            return <View><Image
            style={styles.imageIcon}
            source={{
              uri: player.avatar,
            }}
          /></View>
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    imageIcon:{
        width: 60,
        height: 70,
        borderRadius: 10000,
        margin: 20
    },
    imageContainer:{
        display : "flex",
        flexDirection: "row"
        
    }
})