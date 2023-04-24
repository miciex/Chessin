import { View, Pressable, StyleSheet } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { ColorsPallet } from "../utils/Constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    | "Analyze"
    | "FreeBoard"
    | "GameMenu"
    | "Home"
    | "LastGame"
    | "Login"
    | "PlayBot"
    | "PlayOnline"
    | "PlayWithFriendsMenu"
    | "ProfilePage"
    | "Register"
    | "Socials",
    undefined
  >;
};

export default function Footer({ navigation }: Props) {
  const handlePressFriends = () => {
    navigation.navigate("PlayWithFriendsMenu");
  };

  const handlePressGame = () => {
    navigation.navigate("GameMenu");
  };

  const handleAnalyze = () => {
    navigation.navigate("Analyze");
  };

  return (
    <View style={styles.footerContainer}>
      <Pressable onPress={handlePressFriends}>
        <FontAwesome5 name="user-friends" size={32} color="black" />
      </Pressable>
      <Pressable onPress={handlePressGame}>
        <MaterialCommunityIcons name="sword-cross" size={32} color="black" />
      </Pressable>
      <Pressable onPress={handleAnalyze}>
        <FontAwesome5 name="chess-board" size={32} color="black" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    width: "100%",
    backgroundColor: ColorsPallet.dark,
    height: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
