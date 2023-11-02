import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { countryIsoCodesType } from "../playOnline";
import CountryFlag from "react-native-country-flag";
import { ColorsPallet } from "../../utils/Constants";

type Props = {
  country: countryIsoCodesType;
  setCountry: (countryIsoCode: countryIsoCodesType) => void;
  setCountryValid: (country?: countryIsoCodesType) => void;
  setIsVisible: (isVisible: boolean) => void;
};

export default function CountryItem({
  country,
  setCountry,
  setCountryValid,
  setIsVisible
}: Props) {
  const handleClick = () => {
    setCountry(country);
    setCountryValid(country);
    setIsVisible(false);
  };

  return (
    <Pressable
      key={country.Name}
      style={styles.countryContainer}
      onPress={handleClick}
    >
      <Text>{country.Name}</Text>
      <View>
        <CountryFlag isoCode={country.Code} size={32} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  countryContainer: {
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: ColorsPallet.baseColor,
    padding: 8,
    gap: 8,
  },
});
