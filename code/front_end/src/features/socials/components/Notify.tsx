import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AntDesign } from "@expo/vector-icons";
import { ColorsPallet } from "../../../utils/Constants";
type Props = {
  text: String;
};

export default function Notify({ text }: Props) {

  return (
    <View style={styles.headingContainer}>
        
        <Image
          style={styles.tinyLogo}
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/WoW_icon.svg/1200px-WoW_icon.svg.png",
          }}
        />   
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headingContainer: {
    width: "100%",
    padding: 17,
    backgroundColor: ColorsPallet.baseColor,
    flexDirection: "row",
    borderBottomColor: "rgb(176, 172, 134)",
    borderBottomWidth: 1,
    alignItems: "center"
  },
  text: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    width: "90%",
    // backgroundColor: "blue"
  },
  iconArrow: {
    // backgroundColor: "green",
    width: "20%",
    height: 50,
  },
  tinyLogo: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginRight: 10
  },
});
