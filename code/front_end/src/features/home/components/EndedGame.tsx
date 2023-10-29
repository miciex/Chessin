import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import React from "react";

import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { ColorsPallet, StackParamList } from "../../../utils/Constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../Routing";

type Props = {
  date: String;
  nick: string;
  rank: number;
  result?: string;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    StackParamList,
    undefined
  >;
  gameId: number
};

const EndedGame = ({ nick, rank, result, date, navigation, gameId }: Props) => {
  const Result = () => {
    if (result == "win") {
      return <FontAwesome5 name="trophy" size={17} color="rgb(235, 203, 47)" />;
    } else if (result == "draw") {
      return <FontAwesome5 name="balance-scale" size={17} color="black" />;
    } else if (result == "lose") {
      return (
        <Text>
          <FontAwesome name="close" size={20} color="rgb(194, 10, 10)" />{" "}
        </Text>
      );
    }
    return null;
  };

  const goToFriendsProfile = () => {
    navigation.navigate("ProfilePage", {nameInGame: nick});
  };

  return (
    <View style={styles.record}>
      <View style={styles.buttonContainer}>
      <Pressable
        style={styles.playerInfo}
        onPress={goToFriendsProfile}
        android_ripple={{
          color: ColorsPallet.darker,
          borderless: false,
        }}
      >
        <Image
        style={styles.tinyLogo}
        source={{
          uri: "https://play-lh.googleusercontent.com/aTTVA77bs4tVS1UvnsmD_T0w-rdZef7UmjpIsg-8RVDOVl_EVEHjmkn6qN7C0teRS3o",
        }}
      />   
        <Text>
          {nick} {Math.floor(rank)}
        </Text>
      </Pressable>
      </View>
        <View style={styles.gameInfoContainer}>
          <Text style={styles.dateText}> {date}{"   "}</Text>
          <Pressable onPress={()=>{
            navigation.navigate("AnalyzeGame", {gameId})
          }}><FontAwesome5 name="chess-board" size={22} color="black" /></Pressable>
          
          <Text
            style={{
              color: ColorsPallet.baseColor,
            }}
          >{"  "}
          </Text>
          <Result />
        </View>
    </View>
  );
};
export default EndedGame;

const styles = StyleSheet.create({
  record: {
    backgroundColor: ColorsPallet.baseColor,
    width: "100%",
    height: 55,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textDecorationStyle: "none",
    marginTop: 16,
    display: "flex",
  },
  playerInfo: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    borderRadius: 15,
  },
  dateText: {
    fontSize: 11,
    color: "#b3afaf",
  },
  gameInfoContainer:{
    flex:1,
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  tinyLogo: {
    width: 25,
    height: 25,
    borderRadius: 50,
    marginRight: 10
  },
  buttonContainer: {
    width: "50%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 10,
    flexDirection: "row",
  },
});
