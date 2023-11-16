import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";

import { ColorsPallet } from "../utils/Constants";
import InputField from "../components/InputField";
import Friend from "../features/playWithFriend/components/Friend";
import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import Submit from "../features/login/components/Submit";
import {
  getFriendsList,
  handleSearchBarSocials,
  setUserDataFromResponse,
} from "../services/userServices";
import { HandleSearchBarSocials } from "../utils/ServicesTypes";
import { ResponseUser, responseUserToUser } from "../utils/PlayerUtilities";
import { User } from "../utils/PlayerUtilities";
import Heading from "../components/Heading";
import BaseButton from "../components/BaseButton";
import Animated, { BounceInDown, BounceInUp } from "react-native-reanimated";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "Avatar",
    undefined
  >;
  route: RouteProp<RootStackParamList, "Avatar">;
};

export default function AvatarPage({ route, navigation }: Props) {
  const availableAvatars = [
    "https://i.pinimg.com/736x/6c/93/d5/6c93d5d36dde3329ce98df15f3cf6e02.jpg",
    "https://static.wikia.nocookie.net/peppapedia/images/0/0c/135-1354420_join-the-battle-clash-royale.png.jpeg/revision/latest?cb=20211230123401",
    "https://i.pinimg.com/736x/65/bf/3c/65bf3cbed21ec7d42320a310f2f8bf57.jpg",
    "https://i.pinimg.com/474x/63/50/dd/6350ddb0e3c08bb37a7c793c6c98d89c.jpg",
    "https://static.wikia.nocookie.net/listofdeaths/images/5/5d/Paul_Allen.jpg/revision/latest?cb=20230318042954",
    "https://64.media.tumblr.com/7d9b64b3eb263e650b380a7caf8b8cd7/449be5f0a999d773-48/s500x750/945117f6f226e57b517f17982f0073170f14c5ad.jpg",
    "https://d26oc3sg82pgk3.cloudfront.net/files/media/edit/image/19320/square_thumb%402x.jpg",
    "https://i.redd.it/9cpb6j2432271.jpg",
    "https://images.sftcdn.net/images/t_app-icon-m/p/6df546cd-4628-4de0-aa36-2292533d3509/3571533226/yeah-buddy-by-ronnie-coleman-logo",
  ];

  const start = 0; // Start index
  const stop = availableAvatars.length; // Stop index (exclusive)
  const step = 2; // Step size

  const [selected, setSelected] = useState<number>();

  const handlePress = (index: React.SetStateAction<number | undefined>) => {
    setSelected(index);
    if (selected == index) setSelected(-1);
  };

  return (
    <View style={styles.appContainer}>
      <Heading text={"Avatars"} />
      <ScrollView>
        {availableAvatars.map((avatar, index) =>
          index % step == 0 ? (
            <View key={index} style={styles.scrollView}>
              <Pressable
                android_ripple={{
                  color: ColorsPallet.darker,
                  borderless: false,
                }}
                style={{
                  width: "50%",
                  backgroundColor:
                    index == selected
                      ? ColorsPallet.dark
                      : ColorsPallet.baseColor,
                }}
                onPress={() => {
                  handlePress(index);
                }}
              >
                <Image source={{ uri: avatar }} style={styles.image} />
              </Pressable>

              <Pressable
                android_ripple={{
                  color: ColorsPallet.darker,
                  borderless: false,
                }}
                style={{
                  width: "50%",
                  backgroundColor:
                    index + 1 == selected
                      ? ColorsPallet.dark
                      : ColorsPallet.baseColor,
                }}
                onPress={() => {
                  handlePress(index + 1);
                }}
              >
                <Image
                  source={{ uri: availableAvatars[index + 1] }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </Pressable>
            </View>
          ) : (
            ""
          )
        )}
      </ScrollView>
      {selected && selected > -2 ? (
        <Animated.View
          style={{ width: "100%", height: 60 }}
          entering={BounceInDown}
        >
          <BaseButton
            text="Zatwierdź"
            handlePress={() => {
              console.log(1);
            }}
            color={ColorsPallet.light}
          />
        </Animated.View>
      ) : (
        ""
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  avatarContainer: {
    backgroundColor: "red",
  },

  image: {
    minWidth: 150,
    minHeight: 150,
    aspectRatio: 1 / 1,
    borderRadius: 10000,
  },
  appContainer: {
    flex: 1,

    backgroundColor: ColorsPallet.lighter,
  },
  cell: {
    width: "48%", // Adjust this value based on your styling preference
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
  },
});
