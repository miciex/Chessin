import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";

import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { ColorsPallet, StackParamList } from "../../../utils/Constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../Routing";
import BaseButton from "../../../components/BaseButton";
import {
  addFriendFunc,
  answerToGameInvitation,
  fetchUser,
  handleFriendInvitationFunc,
} from "../../../services/userServices";
import { ChessGameResponse, FriendInvitationResponseType } from "../../../utils/ServicesTypes";
import { User } from "../../../utils/PlayerUtilities";
import { getValueFor } from "../../../utils/AsyncStoreFunctions";
import { HandleFriendInvitation } from "../../../utils/ServicesTypes";

type Props = {
  email: string;
  nick: string;
  rank: Number;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    StackParamList,
    undefined
  >;
};

const InvitationToGame = ({ email, nick, rank, navigation }: Props) => { 
  const goToFriendsProfile = () => {
    navigation.navigate("ProfilePage", { nameInGame: nick });
  };

  const [user, setUser] = useState<User>();

  useEffect(() => {
    getValueFor("user").then((user) => {
      if(!user ) return;
      setUser(JSON.parse(user));
    })
    .catch((err) => {
      throw new Error(err)});
  });

  const handleAnswerToGameInvitation = (request: HandleFriendInvitation) => {
    answerToGameInvitation(request)
      .then((response:null|ChessGameResponse) => {
        if(!response) return;
        navigation.navigate("PlayOnline");
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

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
            <Text style={{ fontSize: 20, width: 300 }}>
              {nick} zaprasza do gry
            </Text>
            <Text style={{ color: "rgb(212, 209, 207)" }}>
              {user?.highestRanking.toString()}
            </Text>
          </View>
        </Pressable>
      </View>

      <View>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <View style={styles.confirmButton}>
            <BaseButton
              text="Accept"
              handlePress={() => {
                handleAnswerToGameInvitation(
                  {
                    friendNickname: nick,
                    responseType: FriendInvitationResponseType.ACCEPT,
                  }
                );
              }}
              color="green"
            />
          </View>
          <View style={styles.confirmButton}>
            <BaseButton
              text="Reject"
              handlePress={() => {
                handleAnswerToGameInvitation(
                  {
                    friendNickname: nick,
                    responseType: FriendInvitationResponseType.DECLINE,
                  }
                );
              }}
              color="red"
            />
          </View>
        </View>
      </View>
    </View>
  );
};
export default InvitationToGame;

const styles = StyleSheet.create({
  record: {
    backgroundColor: ColorsPallet.baseColor,
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
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
    flexDirection: "column",
  },

  tinyLogo: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginRight: 10,
  },
  buttonContainer: {},
  confirmButton: {
    width: 150,
    height: 55,
    marginTop: 10,
    marginBottom: 20,
  },
});
