import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useContext } from "react";
import { User } from "../../../context/UserContext";
import { FontAwesome5 } from "@expo/vector-icons";
import { ColorsPallet } from "../../../utils/Constants";
import { chosenFriendContext } from "../context/ChosenFriendContext";

type Props = {
  friend: User;
  handleChooseFriend: (friend: User) => void;
};

export default function FriendToPlayWith({
  friend,
  handleChooseFriend,
}: Props) {
  const chosenFriend = useContext(chosenFriendContext);

  const handleOnPress = () => {
    handleChooseFriend(friend);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable
          android_ripple={{ color: ColorsPallet.baseColor }}
          style={
            friend?.email === chosenFriend?.email
              ? styles.buttonActive
              : styles.buttonInactive
          }
          onPress={handleOnPress}
        >
          <FontAwesome5 name="user" size={72} color="black" />
          <Text style={styles.textStyle}>{friend.name}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexBasis: "30%",
    justifyContent: "center",
    alignItems: "center",
    height: "40%",
  },
  textStyle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  buttonInactive: {
    alignItems: "center",
    padding: 16,
  },
  buttonActive: {
    alignItems: "center",
    padding: 16,
    backgroundColor: ColorsPallet.dark,
  },
  buttonContainer: {
    alignItems: "center",
    borderRadius: 16,
    overflow: "hidden",
  },
});
