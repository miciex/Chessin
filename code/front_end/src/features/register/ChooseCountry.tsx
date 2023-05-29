import { countryIsoCodes, countryIsoCodesType } from "../playOnline";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import React, { useState } from "react";
import CountryFlag from "react-native-country-flag";
import { ColorsPallet } from "../../utils/Constants";
import { Entypo } from "@expo/vector-icons";

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
  const countries = countryIsoCodes
    .slice(100, 120)
    .map((country: countryIsoCodesType) => (
      <Pressable
        key={country.Name}
        style={styles.countryContainer}
        onPress={() => {
          setCountry(country);
          setCountryValid(country);
        }}
      >
        <Text>{country.Name}</Text>
        <View>
          <CountryFlag isoCode={country.Code} size={32} />
        </View>
      </Pressable>
    ));
  return (
    <View style={styles.container}>
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
      {isVisible ? (
        <ScrollView style={styles.scrollView} nestedScrollEnabled={true}>
          <View style={styles.contentContainer}>{countries}</View>
        </ScrollView>
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
  countryContainer: {
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: ColorsPallet.baseColor,
    padding: 8,
    gap: 8,
  },
  contentContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  scrollView: {
    width: "80%",
    height: 200,
  },
});
