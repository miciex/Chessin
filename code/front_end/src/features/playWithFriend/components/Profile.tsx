import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import React from "react";
import { ColorsPallet } from "../../../utils/Constants";
import { Rankings } from "../../../utils/PlayerUtilities";
import CountryFlag from "react-native-country-flag";
import { countryToIsoCode } from "../../playOnline";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../Routing";

type Props = {
  nick: string;
  rank?: Rankings;
  active?: boolean;
  playing?: boolean;
  avatar?: string;
  country: string;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "ProfilePage",
    undefined
  >;
};

export default function Profile({
  nick,
  rank,
  active,
  playing,
  avatar,
  country,
  navigation,
}: Props) {
  return (
    <View style={styles.profile}>
      <View style={styles.left}>
        <Pressable onPress={() => navigation.navigate("Avatar")}>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: avatar
                ? avatar
                : "https://us-tuna-sounds-images.voicemod.net/6f0b01c1-bf29-4157-a1f7-800327ea9323-1658162982836.jpg",
            }}
          />
        </Pressable>

        <CountryFlag isoCode={countryToIsoCode(country)} size={60} />
      </View>
      <View style={styles.right}>
        <Text style={[styles.text, styles.name]}>{nick}</Text>
        {rank && (
          <>
            <Text style={[styles.text, styles.rank]}>
              Bullet {Math.floor(rank.BULLET).toString()}
            </Text>
            <Text style={[styles.text, styles.rank]}>
              Rapid {Math.floor(rank.RAPID).toString()}
            </Text>
            <Text style={[styles.text, styles.rank]}>
              Blitz {Math.floor(rank.BLITZ).toString()}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profile: {
    backgroundColor: ColorsPallet.baseColor,
    width: "100%",

    padding: 20,
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
    width: "40%",
    // backgroundColor: "green",
    alignItems: "center",
  },
  right: {
    width: "60%",
    // backgroundColor: "red",
  },
  text: {
    textAlign: "center",
  },
  name: {
    fontSize: 30,
  },
  rank: {
    fontSize: 18,
    marginTop: 10,
  },
  tinyLogo: {
    width: 95,
    height: 95,
    borderRadius: 50,
    marginBottom: 10,
  },

  flag: {
    marginTop: 10,
    width: 80,
    height: 40,
    borderRadius: 4,
  },
});
