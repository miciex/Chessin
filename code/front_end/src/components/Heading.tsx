import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { ColorsPallet, StackParamList } from "../utils/Constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { AntDesign } from "@expo/vector-icons";
type Props = {
  text: String;
  stringNavigation?: Function;
  navigation?: NativeStackNavigationProp<
    RootStackParamList,
    StackParamList,
    undefined
  >;
};

export default function Heading({ text, navigation, stringNavigation }: Props) {
  let icon;
 
  if (stringNavigation)
    icon = (
      <AntDesign
        name="right"
        size={24}
        color="black"
        onPress={() =>
         
          stringNavigation()
        }
      />
    );

  return (
    <View style={styles.headingContainer}>
      <Text style={styles.text}>{text}</Text>
      <Pressable
        style={styles.iconArrow}
        android_ripple={{
          color: ColorsPallet.light,
          borderless: false,
        }}
      >
        {icon}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  headingContainer: {
    width: "100%",
    height: 60,
    lineHeight: 60,
    padding: 17,
    backgroundColor: ColorsPallet.dark,
    marginTop: 8,
    display: "flex",
    flexDirection: "row",
  },
  text: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    width: "90%",
    paddingLeft: "10%",
    // backgroundColor: "blue"
  },
  iconArrow: {
    // backgroundColor: "green",
    width: "20%",
    height: 50,
  },
});
