import { View, Text ,Image, StyleSheet, ScrollView, Pressable} from 'react-native'
import React from 'react'
import { RootStackParamList } from '../../../../Routing'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StackParamList } from '../../../utils/Constants'
import { ColorsPallet } from '../../../utils/Constants'
//powinien byc jakis dostep do baxy danych ktory mi da id i avatar najlepszych friends jako objecty

const bestFriends = [
    {rank: 1000, playerNick: "Pusznik", avatar: "https://p.kindpng.com/picc/s/697-6978240_south-park-png-cartman-south-park-png-transparent.png"},
    {rank: 1000, playerNick: "MaciekNieBij" , avatar: "https://p.kindpng.com/picc/s/697-6978240_south-park-png-cartman-south-park-png-transparent.png"},
    {rank: 1000, playerNick: "Slaweczuk", avatar: "https://p.kindpng.com/picc/s/697-6978240_south-park-png-cartman-south-park-png-transparent.png" },
    {rank: 1000, playerNick: "Strzała", avatar: "https://p.kindpng.com/picc/s/697-6978240_south-park-png-cartman-south-park-png-transparent.png" },
    {rank: 1000, playerNick: "Bestia", avatar: "https://p.kindpng.com/picc/s/697-6978240_south-park-png-cartman-south-park-png-transparent.png" },
    {rank: 1000, playerNick: "Sharku", avatar: "https://p.kindpng.com/picc/s/697-6978240_south-park-png-cartman-south-park-png-transparent.png"},
]

type Props={
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    StackParamList,
    undefined
  >;
  
}

export default function FriendsIconList({navigation}: Props) {

  const goToFriendsProfile = (player: {
    rank: number;
    playerNick: string;
    avatar: string;
}) => {
    navigation.navigate("ProfilePage", {
      nick: player.playerNick,
      rank: player.rank,
      avatar: player.avatar
    });
  };
 
  return (
    <View style={styles.container}>
      <ScrollView horizontal={true}>
     
      <View style={styles.imageContainer}>
        {bestFriends.map((player)=>{
            return <Pressable onPress={()=>{
                goToFriendsProfile(player)}} 
                android_ripple={{
                    color: ColorsPallet.darker,
                    borderless: false,
              }} >
            <View style={styles.profile} >
              <Image
                 style={styles.imageIcon}
                 source={{
                   uri: player.avatar,
                 }}
            />
          <Text style={styles.text}>{player.playerNick}</Text>
          </View></Pressable>
        })}
      </View>
      </ScrollView>
    </View>
  )

  
}

const styles = StyleSheet.create({
    imageIcon:{
        width: 60,
        height: 60,
        borderRadius: 30,
        marginHorizontal: 20,
        marginVertical: 8
    },
    imageContainer:{
        display : "flex",
        flexDirection: "row",
      
    },
    container:{
      height: 100
    },
    profile:{
      height: 50
    },
    text:{
      textAlign: "center"
    }
})