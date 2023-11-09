import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";

import EndedGame from "../features/home/components/EndedGame";
import { ColorsPallet } from "../utils/Constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import Heading from "../components/Heading";
import Invitation from "../features/socials/components/Invitation";
import InvitationToGame from "../features/socials/components/InvitationToGame";
import Notify from "../features/socials/components/Notify";
import {
  checkInvitations,
  checkInvitationsToGame,
} from "../services/userServices";
import { User, responseUserToUser } from "../utils/PlayerUtilities";
import { FriendInvitationResponse } from "../utils/ServicesTypes";
import Animated, { BounceInDown, BounceInUp } from "react-native-reanimated";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "Notification",
    undefined
  >;
  route: RouteProp<RootStackParamList, "Notification">;
};

export default function Notification({ route, navigation }: Props) {
  const [invitations, setInvitations] = useState<Array<User>>([]);
  const [invitationsToGame, setInvitationsToGame] = useState<Array<User>>([]);

  useEffect(() => {
    checkInvitations().then((data) => {
      console.log("check invite data: ");
      console.log(data);
      if (!data) return;
      setInvitations(data.map((x) => responseUserToUser(x.user, "")));
    });

    checkInvitationsToGame().then((data) => {
      console.log("invitations");
      console.log(data);
      if (!data) return;
      setInvitationsToGame(data.map((x) => responseUserToUser(x.user, "")));
    });
  }, []);
  return (
    <Animated.View style={styles.appContainer} entering={BounceInUp}>
      <ScrollView>
        <View style={styles.contentContainer}>
          <Heading text={"Notifications"} />
          {invitationsToGame.map((player) => (
            <InvitationToGame
              nick={player.nameInGame}
              rank={player.highestRanking}
              navigation={navigation}
              email={player.email}
            />
          ))}
          {invitations.map((player) => (
            <Invitation
              nick={player.nameInGame}
              rank={player.highestRanking}
              navigation={navigation}
              email={player.email}
            />
          ))}
          <Notify text="Gratulacje osiagnales 1000 elo" />
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignContent: "stretch",
    backgroundColor: ColorsPallet.light,
  },
  contentContainer: {
    marginTop: 12,
    flex: 8,
    alignItems: "center",
  },
});
