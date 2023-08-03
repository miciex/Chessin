import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";

import EndedGame from "../features/home/components/EndedGame";
import { ColorsPallet } from "../utils/Constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import Submit from "../features/login/components/Submit";
import Footer from "../components/Footer";
import Heading from "../components/Heading";
import Invitation from "../features/socials/components/Invitation";
import Notify from "../features/socials/components/Notify";
import { checkInvitations } from "../services/userServices";
import { User, responseUserToUser } from "../utils/PlayerUtilities";

const ended_games = [
  { date: "01.10.2022", playerNick: "Pusznik", rank: 1500, lastGameResult: "win" },
  { date: "01.10.2022", playerNick: "MaciekNieBij", rank: 1500, lastGameResult: "win" },
  { date: "01.10.2022", playerNick: "Slaweczuk", rank: 1500, lastGameResult: "win" },
  { date: "01.10.2022", playerNick: "Strzała", rank: 1500, lastGameResult: "lose" },
  { date: "01.10.2022", playerNick: "Bestia", rank: 1500, lastGameResult: "win" },
  { date: "01.10.2022", playerNick: "Sharku", rank: 1000, lastGameResult: "lose" },
  { date: "01.10.2022", playerNick: "Zocho", rank: 1300, lastGameResult: "draw" },
  { date: "01.10.2022", playerNick: "Zocho", rank: 1300, lastGameResult: "draw" },
  { date: "01.10.2022", playerNick: "Zocho", rank: 1300, lastGameResult: "draw" },
  { date: "01.10.2022", playerNick: "Zocho", rank: 1300, lastGameResult: "draw" },
];

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "Notification",
    undefined
  >;
  route: RouteProp<RootStackParamList, "Notification">;
};

export default function Notification({ route, navigation }: Props) {

  const [invitations, setInvitations] = useState<Array<User>>([])
  
  useEffect(()=>{
    

    checkInvitations().then((data) =>{ 
      console.log(data)
      if(data === undefined) return
      setInvitations(data.map(x => responseUserToUser(x, "")))
    })
  }, [])
  return (
    <View style={styles.appContainer}>
      <ScrollView>
        <View style={styles.contentContainer}>
        <Heading text={"Notifications"} />
        {invitations.map(player=>(
             <Invitation nick={player.nameInGame} rank={player.highestRanking} navigation={navigation} email={player.email}/>
        ))}
         <Notify text="Gratulacje osiagnales 1000 elo"/>
         
        </View>
      </ScrollView>
    
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignContent: "stretch",
    backgroundColor: ColorsPallet.light,
  },
  contentContainer: {
    marginTop: 12,
    flex: 8,
    alignItems: "center",
  },

  endedGames: {},
  endGame: {},
});
