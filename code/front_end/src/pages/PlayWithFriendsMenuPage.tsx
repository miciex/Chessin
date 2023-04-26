import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";

import { ColorsPallet } from "../utils/Constants";
import SendInvitation from "../features/playOnline/components/SendInvitation";
import InputField from "../components/InputField";
import Friend from "../features/playOnline/components/Friend";
import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import Submit from "../features/login/components/Submit";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "PlayWithFriendsMenu",
    undefined
  >;

  route: RouteProp<RootStackParamList, "PlayWithFriendsMenu">;
};

export default function PlayWithFriendsMenuPage({ navigation, route }: Props) {
  // const { nick } = route.params;
  const { nick } = route.params;

  return (
    <View>
      <Text></Text>
    </View>
  );
}
