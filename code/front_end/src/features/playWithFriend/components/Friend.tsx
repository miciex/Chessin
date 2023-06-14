import { View, Pressable, StyleSheet, Text, Image } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { ColorsPallet, StackParamList } from "../../../utils/Constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../Routing";
import {User } from "../../../utils/PlayerUtilities";

type Props = {
  user: User;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    StackParamList,
    undefined
  >;
};
const Friend = ({ navigation, user }: Props) => {

  console.log(user.ranking)
  
  const PlayingEye = () => {
    if (!user.playing) {
      return null;
    }
    return <FontAwesome5 name="eye" size={18} color="green" />;
  };
  const Online = () => {
    if (!user.online) {
      return <Fontisto name="radio-btn-active" size={9} color="black" />;
    }
    return <Fontisto name="radio-btn-active" size={9} color="green" />;
  };

  const goToFriendsMenu = () => {
    navigation.navigate("PlayWithFriendsMenu");
  };
  const goToFriendsProfile = () => {
    navigation.navigate("ProfilePage");
  };
  return (
    <View style={styles.record}>
   
   <View style={styles.cornerPressable}>
      <Pressable style={styles.left} onPress={goToFriendsProfile}  android_ripple={{
                  color: ColorsPallet.darker,
                  borderless: false,
                }}>
      <Image
        style={styles.tinyLogo}
        source={{
          uri: "https://play-lh.googleusercontent.com/aTTVA77bs4tVS1UvnsmD_T0w-rdZef7UmjpIsg-8RVDOVl_EVEHjmkn6qN7C0teRS3o",
        }}
      />             
      <Text >
        <Online /> {user.nameInGame} {user.ranking.classical.toString()}
      </Text>
      </Pressable>
      </View>
      <View style={styles.right}>
        <Text style={{ textAlign: "right", width: "100%" }}>
          <PlayingEye />
          {"  "}
          <FontAwesome5
            name="chess-board"
            size={18}
            color="black"
            onPress={goToFriendsMenu}
          />
        </Text>
      </View>
    </View>
  );
};
export default Friend;

const styles = StyleSheet.create({
  record: {
    backgroundColor: ColorsPallet.baseColor,
    width: "100%",
    paddingRight: 15,
    borderRadius: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    textAlign: "center",
    textDecorationStyle: "none",
    marginBottom: 7,
    marginTop: 7,
    display: "flex",
    alignItems: "center",

  },
  left: {
    width: "100%",
    paddingLeft: 10,
    flexDirection: "row",
    paddingTop: 15,
    paddingBottom: 15,
  },
  right: {
    width: "30%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tinyLogo: {
    width: 25,
    height: 25,
    borderRadius: 50,
    marginRight: 10
  },
  cornerPressable:{
    width: "70%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 12,
    flexDirection: "row",
  }
});
