import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import React from "react";

import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { ColorsPallet, StackParamList } from "../../../utils/Constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../Routing";
import { RouteProp } from "@react-navigation/native";
// import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap%27);
// import { useFonts, Inter_900Black } from "@expo-google-fonts/inter";
// import { Inter_400Regular, useFonts } from "@expo-google-fonts/inter";

type Props = {
  date: String;
  nick: string;
  rank: Number;
  result?: string;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    StackParamList,
    undefined
  >;
};

const EndedGame = ({ nick, rank, result, date, navigation }: Props) => {
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
    navigation.navigate("ProfilePage", {
      nick,
      rank,
    });
  };

  return (
    <View style={styles.record}>
      {/* <Image source={}/> */}
      <Pressable
        style={[styles.left, styles.back]}
        onPress={goToFriendsProfile}
      >
        <Text>
          {nick} {rank.toString()}
        </Text>
      </Pressable>
      <View style={styles.right}>
        <Text style={{ textAlign: "right", width: "100%" }}>
          <Text style={styles.dateText}> {date}</Text>
          {"  "}
          <FontAwesome5 name="chess-board" size={18} color="black" />

          <Text
            style={{
              color: ColorsPallet.baseColor,
              paddingRight: 8,
            }}
          >
            {"  "}
          </Text>
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
    width: "87%",
    height: 55,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textDecorationStyle: "none",
    margin: 8,
    display: "flex",
  },
  left: {
    width: "55%",
  },
  right: {
    width: "45%",
  },
  back: {
    backgroundColor: ColorsPallet.baseColor,
  },
  dateText: {
    fontSize: 11,
    color: "#b3afaf",
  },
});
