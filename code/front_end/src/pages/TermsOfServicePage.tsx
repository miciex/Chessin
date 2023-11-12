import { View, Text } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import BaseButton from "../components/BaseButton";
import { save } from "../utils/AsyncStoreFunctions";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "TermsOfService",
    undefined
  >;
  route: RouteProp<RootStackParamList, "TermsOfService">;
};

export default function TermsOfServicePage({ navigation, route }: Props) {
  const handleAccept = () => {
    save("termsOfServiceAccepted", "true")
      .then(() => {
        navigation.navigate("UserNotAuthenticated");
      })
      .catch(() => {
        throw new Error("Error while saving terms of service accepted");
      });
  };

  return (
    <View>
      <Text>TermsOfServicePage</Text>
      <BaseButton text="accept" handlePress={handleAccept} />
    </View>
  );
}
