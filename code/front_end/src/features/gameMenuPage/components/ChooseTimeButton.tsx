import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { ColorsPallet } from "../../../utils/Constants";
import BaseCustomContentButton from "../../../components/BaseCustomContentButton";
import { FontAwesome5 } from "@expo/vector-icons";
<FontAwesome5 name="angle-down" size={24} color="black" />;

type Props = {
  handleOpenModal: () => void;
};

export default function ChooseTimeButton({ handleOpenModal }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.chooseTimeButtonOuterContainer}>
        <Pressable
          onPress={handleOpenModal}
          android_ripple={{ color: ColorsPallet.lighter }}
        >
          <View style={styles.buttonContentContainer}>
            <View style={styles.mainButtonContentContainer}>
              <Text style={styles.buttonText}>2|1</Text>
            </View>
            <View style={styles.arrowDownContainer}>
              <FontAwesome5
                name="angle-down"
                size={24}
                color={ColorsPallet.lighter}
              />
            </View>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    width: "100%",
    justifyContent: "center",
    height: 32,
    alignItems: "center",
  },
  chooseButtonInnerContainer: {},
  chooseTimeButtonOuterContainer: {
    width: "75%",
    height: "50%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: ColorsPallet.darker,
  },
  buttonText: {
    color: ColorsPallet.lighter,
    fontSize: 24,
  },
  buttonContentContainer: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
  mainButtonContentContainer: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowDownContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
