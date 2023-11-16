import { View, StyleSheet } from "react-native";
import React from "react";
import { User } from "../../../utils/PlayerUtilities";
import FriendToPlayWith from "./FriendToPlayWith";

type Props = {
  friends: Array<User>;
  handleChooseFriend: (friend: User) => void;
};

export default function ChooseFriendsToPlayWith({
  friends,
  handleChooseFriend,
}: Props) {
  const content = friends.map((friend) => (
    <FriendToPlayWith
      friend={friend}
      handleChooseFriend={handleChooseFriend}
      key={friend.nameInGame}
    />
  ));

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    flexWrap: "wrap",
    rowGap: 32,
    justifyContent: "space-evenly",
    alignItems: "stretch",
  },
});
