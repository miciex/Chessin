import { View, Text, StyleSheet,TouchableOpacity } from "react-native";
import React from "react";

import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import Profile from "../features/playOnline/components/Profile";
import { ColorsPallet } from "../utils/Constants";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "PlayWithFriendsMenu",
    undefined
  >;

  route: RouteProp<RootStackParamList, "PlayWithFriendsMenu">;
};

export default function PlayWithFriendsMenuPage({ navigation, route }: Props) {
  // const { nick } = route.params;
  const { nick,active,playing,rank } = route.params;

  return (
    <View style={styles.appContainer}>
    <View style={styles.contentContainer}>
      <View style={{width: "90%", height: 200, alignItems: "center", marginBottom: 20}}>
      <Profile nick={nick} rank={rank} />
      </View>
   
    <View style={styles.timer}> 
    <TouchableOpacity>
      <Text style={styles.text}>10:00</Text>
      </TouchableOpacity>
      
    </View>
    
    </View>

    <Footer navigation={navigation} />
  </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignContent: "stretch",
  },
  contentContainer: {
    marginTop: 32,
    flex: 8,
    alignItems: "center",
  },
  timer:{
    width: "70%",
    height: 60,
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 6
  },
  text:{
    textAlign: "center",
    fontSize: 24,
    lineHeight: 36
  }
});
