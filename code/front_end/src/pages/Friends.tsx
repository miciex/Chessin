import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { ColorsPallet } from "../utils/Constants";
import Friend from "../features/playWithFriend/components/Friend";
import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import { getFriendsList } from "../services/userServices";
import { ResponseUser, responseUserToUser } from "../utils/PlayerUtilities";
import { User } from "../utils/PlayerUtilities";
import Heading from "../components/Heading";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "Friends",
    undefined
  >;
  route: RouteProp<RootStackParamList, "Friends">;
};

export default function Friends({ route, navigation }: Props) {
  const [friends, setFriends] = useState<Array<User>>([]);

  const nameInGame = route?.params?.nameInGame;

  useEffect(() => {
    if (nameInGame)
      getFriendsList(nameInGame).then((data: null | ResponseUser[]) => {
        if (!data) return;
        setFriends(data.map((x) => responseUserToUser(x, "")));
      });
  }, [nameInGame]);

  return (
    <View style={styles.appContainer}>
      <Heading text={"Friends"} />
      <View style={styles.formContainer}>
        <ScrollView>
          <View style={styles.scrollView}>
            {friends.map((gracz) => (
              <Friend user={gracz} navigation={navigation} />
            ))}
            {friends.length > 0 ? (
              ""
            ) : (
              <View style={{ paddingTop: "30%" }}>
                <Text style={{ color: ColorsPallet.baseColor, fontSize: 20 }}>
                  No Friends Yet
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      <Footer navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 8,
    alignItems: "center",
    backgroundColor: ColorsPallet.light,
    width: "90%",
  },
  appContainer: {
    backgroundColor: ColorsPallet.light,
    flex: 1,
    alignContent: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    alignItems: "center",
    marginLeft: "5%",
    width: "90%",
  },
});
