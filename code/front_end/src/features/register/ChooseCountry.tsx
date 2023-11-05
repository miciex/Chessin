import { countryIsoCodes, countryIsoCodesType } from "../playOnline";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import CountryFlag from "react-native-country-flag";
import { ColorsPallet } from "../../utils/Constants";
import { Entypo } from "@expo/vector-icons";
import CountryItem from "./CountryItem";

type Props = {
  setCountry: (countryIsoCode: countryIsoCodesType) => void;
  setIsVisible: (isVisible: boolean) => void;
  isVisible: boolean;
  country: countryIsoCodesType | undefined;
  setCountryValid: (country?: countryIsoCodesType) => void;
};

export default function ChooseCountry({
  setCountry,
  setIsVisible,
  isVisible,
  country,
  setCountryValid,
}: Props) {
  const countries = (
    <FlatList
      data={countryIsoCodes}
      renderItem={({ item }) => (
        <CountryItem
          setCountry={setCountry}
          setCountryValid={setCountryValid}
          setIsVisible={setIsVisible}
          country={item}
        />
      )}
      keyExtractor={(item) => item.Code}
      style={styles.list}
      contentContainerStyle={styles.listContainer}
    />
  );
  return (
    <View style={styles.container}>
      {!isVisible ? (
        <View style={styles.descriptionContainer}>
          {country ? <CountryFlag isoCode={country.Code} size={24} /> : null}
          <Text>ChooseCountry</Text>
          <Pressable onPress={() => setIsVisible(!isVisible)}>
            {isVisible ? (
              <Entypo name="cross" size={24} color="black" />
            ) : (
              <Entypo name="chevron-down" size={24} color="black" />
            )}
          </Pressable>
        </View>
      ) : null}
      {isVisible ? (
        <View style={styles.contentContainer}>{countries}</View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    gap: 8,
    paddingTop: 8,
  },
  descriptionContainer: {
    width: "100%",
    height: 36,
    backgroundColor: ColorsPallet.baseColor,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
  },
  contentContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  list: {
    width: "100%",
  },
  listContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
