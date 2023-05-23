import { View, Pressable, StyleSheet, Text } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { ColorsPallet, StackParamList } from "../../../utils/Constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../Routing";
import { RouteProp } from "@react-navigation/native";

type Props = {
  nick: string;
  rank: Number;
  active: boolean;
  playing: boolean;
  navigateToPlayWithFriend?: Function;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    StackParamList,
    undefined
  >;
};
const Friend = ({ navigation, nick, rank, playing, active }: Props) => {
  const PlayingEye = () => {
    if (!playing) {
      return null;
    }
    return <FontAwesome5 name="eye" size={18} color="green" />;
  };
  const Online = () => {
    if (!active) {
      return <Fontisto name="radio-btn-active" size={9} color="black" />;
    }
    return <Fontisto name="radio-btn-active" size={9} color="green" />;
  };

  const goToFriendsMenu = () => {
    navigation.navigate("PlayWithFriendsMenu", {
      nick,
      rank,
      playing,
      active,
    });
  };
  const goToFriendsProfile = () => {
    navigation.navigate("ProfilePage", {
      nick,
      rank,
      playing,
      active
    });
  };
  return (
    <View style={styles.record}>
      {/* <Image source={}/> */}
      <Pressable style={styles.left} onPress={goToFriendsProfile}  android_ripple={{
                  color: ColorsPallet.lighter,
                  borderless: false,
                }}>
      <Text >
        <Online /> {nick} {rank.toString()}
      </Text>
      </Pressable>
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
    height: 58,
    paddingTop: 5,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    textAlign: "center",
    textDecorationStyle: "none",
    marginBottom: 10,
    marginTop: 10,
    display: "flex",
  },
  left: {
    width: "70%",
    paddingTop: 15,
    paddingBottom:10,
  },
  right: {
    width: "30%",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 15,
    paddingBottom:10,
  },
});
