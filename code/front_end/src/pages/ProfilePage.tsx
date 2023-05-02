import { View, Text, StyleSheet } from "react-native";
import React from "react";

import Profile from "../features/playOnline/components/Profile";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "ProfilePage",
    undefined
  >;

  route: RouteProp<RootStackParamList, "ProfilePage">;
}

export default function ProfilePage({navigation, route}: Props) {
  const {nick, rank, active, playing} = route.params;
  return (
    <View style={styles.container}>
    <View style={styles.profile}>
      <Profile nick={nick} rank={rank} active={active} playing={playing} />
    </View></View>
  );
}


const styles = StyleSheet.create({
  profile:{
    width: "90%",
    
  },
  container:{
    alignItems: "center"
  }
})