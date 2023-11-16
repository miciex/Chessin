import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { RootStackParamList } from "../../../../Routing";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../../utils/Constants";
import { ColorsPallet } from "../../../utils/Constants";
import { getFriendsList } from "../../../services/userServices";
import {
  ResponseUser,
  User,
  responseUserToUser,
} from "../../../utils/PlayerUtilities";
import { FontAwesome } from "@expo/vector-icons";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    StackParamList,
    undefined
  >;
  nameInGame: string;
};

export default function FriendsIconList({ navigation, nameInGame }: Props) {
  const [friends, setFriends] = useState<Array<User>>([]);

  useEffect(() => {
    if (nameInGame)
      getFriendsList(nameInGame).then((data: null | ResponseUser[]) => {
        if (!data) return;
        setFriends(data.map((x) => responseUserToUser(x, "")));
      });
  }, [nameInGame]);

  const goToFriendsProfile = (playerNick: string) => {
    navigation.navigate("ProfilePage", {
      nameInGame: playerNick,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal={true}>
        <View style={styles.imageContainer}>
          {friends.map((player) => {
            return (
              <Pressable
                onPress={() => {
                  goToFriendsProfile(player.nameInGame);
                }}
                android_ripple={{
                  color: ColorsPallet.darker,
                  borderless: false,
                }}
              >
                <View style={styles.profile}>
                  <View>
                    <FontAwesome name="user-circle" size={50} color="black" />
                  </View>
                  <Text style={styles.text}>{player.nameInGame}</Text>
                </View>
              </Pressable>
            );
          })}
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
  );
}

const styles = StyleSheet.create({
  imageIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 20,
    marginVertical: 8,
  },
  imageContainer: {
    display: "flex",
    flexDirection: "row",
  },
  container: {
    height: 100,
  },
  profile: {
    marginTop: 16,
    height: 50,
    marginLeft: 6,
  },
  text: {
    textAlign: "center",
  },
});
