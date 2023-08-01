import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import React from "react";

import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { ColorsPallet, StackParamList } from "../../../utils/Constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../Routing";
import BaseButton from "../../../components/BaseButton";
import { addFriendFunc } from "../../../services/userServices";

type Props = {
  nick: string;
  rank: Number;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    StackParamList,
    undefined
  >;
};

const Invitation = ({ nick, rank, navigation }: Props) => {
  const goToFriendsProfile = () => {
    navigation.navigate("ProfilePage");
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
          <View>
            <Text style={{ fontSize: 20 }}>{nick}</Text>
            <Text style={{ color: "rgb(212, 209, 207)" }}>
              {rank.toString()}
            </Text>
          </View>
        </Pressable>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={{ textAlign: "center" }}>Zaproszenie do znajomych</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={styles.confirmButton}>
            <BaseButton
              text="Accept"
              handlePress={() => {
                addFriendFunc(nick);
              }}
              color="green"
            />
          </View>
          <View style={styles.confirmButton}>
            <BaseButton text="Reject" handlePress={() => {}} color="red" />
          </View>
        </View>
      </View>
      <View style={styles.gameInfoContainer}>
        <Text
          style={{
            color: ColorsPallet.baseColor,
          }}
        >
          {"  "}
        </Text>
      </View>
    </View>
  );
};
export default Invitation;

const styles = StyleSheet.create({
  record: {
    backgroundColor: ColorsPallet.baseColor,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textDecorationStyle: "none",
    display: "flex",
    borderBottomColor: "rgb(176, 172, 134)",
    borderBottomWidth: 1,
  },
  playerInfo: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
  },
  dateText: {
    fontSize: 11,
    color: "#b3afaf",
  },
  gameInfoContainer: {
    flex: 1,
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  tinyLogo: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginRight: 10,
  },
  buttonContainer: {
    width: "35%",
    height: "100%",
    overflow: "hidden",
    flexDirection: "row",
  },
  confirmButton: {
    width: 110,
    height: 45,
    marginTop: 10,
    marginBottom: 20,
  },
});
