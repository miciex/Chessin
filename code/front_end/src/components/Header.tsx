import { FontAwesome } from "@expo/vector-icons";
import { View, Pressable, StyleSheet, Text } from "react-native";
import React from "react";
import { ColorsPallet } from "../utils/Constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { StackParamList } from "../utils/Constants";

type Props = {
  navigation?: NativeStackNavigationProp<
    RootStackParamList,
    StackParamList,
    undefined
  >;
  console: Function;
};

export default function Header({ navigation, console }: Props) {
  const goToProfilePage = () => {
    navigation?.navigate("ProfilePage", {nick:"wojtek", rank:3000, active:false, playing:false, avatar:"zdjeic"})
  };
  return (
    <View style={styles.header}>
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Chessin</Text>
        <Pressable onPress={()=>goToProfilePage}>
          <FontAwesome
            name="user-circle"
            size={32}
            color="black"
            style={styles.headerImage}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignContent: "stretch",
    backgroundColor: ColorsPallet.darker,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 32,
    fontWeight: "700",
    color: ColorsPallet.light,
  },
  headerImage: {
    marginBottom: 4,
  },
  contentContainer: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
