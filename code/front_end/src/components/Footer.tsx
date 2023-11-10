import { View, Pressable, StyleSheet } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { ColorsPallet } from "../utils/Constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { StackParamList } from "../utils/Constants";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    StackParamList,
    undefined
  >;
};

export default function Footer({ navigation }: Props) {
  const handlePressFriends = () => {
    navigation.navigate("Socials");
  };

  const handlePressHome = () => {
    navigation.replace("Home");
  };

  const handleAnalyze = () => {
    navigation.navigate("LastGame");
  };

  return (
    <View style={styles.footerContainer}>
      <Pressable onPress={handlePressFriends}>
        <FontAwesome5 name="user-friends" size={32} color="black" />
      </Pressable>
      <Pressable onPress={handlePressHome}>
        <FontAwesome5 name="home" size={32} color="black" />
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
