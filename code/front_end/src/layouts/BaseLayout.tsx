import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login", undefined>;
};

export default function BaseLayout({ navigation }: Props) {
  return (
    <>
      <View style={styles.formContainer}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}></View>
      </View>
      <Footer navigation={navigation} />
    </>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignContent: "stretch",
  },
  formContainer: {
    flex: 8,
    alignItems: "center",
  },
});
