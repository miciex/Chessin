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
  nick: string;
  rank: Number;
  result: string;
  navigateToPlayWithFriend?: Function;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    StackParamList,
    undefined
  >;
};

const EndedGame = ({ nick, rank, result, navigation }: Props) => {
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

  return (
    <View style={styles.record}>
      {/* <Image source={}/> */}
      <Text style={styles.left}>
        {nick} {rank.toString()}
      </Text>
      <View style={styles.right}>
        <View
          style={{
            alignItems: "flex-end",
            width: "100%",
            flexDirection: "row",
          }}
        >
          <Pressable
            onPress={() => {
              navigation.navigate("PlayWithFriendsMenu", {
                nick,
                rank,
                playing: true,
                active: true,
              });
            }}
          >
            <FontAwesome5 name="chess-board" size={18} color="black" />
          </Pressable>

          <Text
            style={{
              color: ColorsPallet.baseColor,
              paddingRight: 8,
            }}
          >
            {"  "}
          </Text>
          <Result />
        </View>
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
    padding: 20,
    paddingLeft: 35,
    paddingRight: 25,
    borderRadius: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    textAlign: "center",
    textDecorationStyle: "none",
    margin: 8,
    display: "flex",
  },
  left: {
    width: "80%",
  },
  right: {
    width: "20%",
  },
});
