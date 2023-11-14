import { View, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../Routing";
import Footer from "../components/Footer";
import { ColorsPallet } from "../utils/Constants";
import PlayOnlineOptions from "../features/gameMenuPage/components/PlayOnlineOptions";
import { User } from "../utils/PlayerUtilities";
import { getValueFor } from "../utils/AsyncStoreFunctions";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "GameMenu",
    undefined
  >;
  route: RouteProp<RootStackParamList, "GameMenu">;
};

export default function GameMenu({ navigation }: Props) {
  useEffect(() => {
    getValueFor("user").then((user) => {
      if (!user) return;
      setUser(JSON.parse(user));
    });
  }, []);

  const [user, setUser] = useState<User | null>(null);

  return (
    <View style={styles.appContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.chooseGameContainer}>
          <PlayOnlineOptions navigation={navigation} user={user} />
        </View>
      </View>
      <Footer navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignContent: "stretch",
    backgroundColor: ColorsPallet.light,
  },
  contentContainer: {
    flex: 8,
    alignItems: "center",
  },
  chooseGameContainer: {
    flex: 7,
    alignItems: "center",
    gap: 16,
  },
  bottomButtonsContainer: {
    flex: 2,
    width: "100%",
  },
  gameOptionsContainer: {
    width: "100%",
    flex: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  pickColorContainer: {
    width: "100%",
    flex: 1,
  },
  pickColorInnerContainer: {
    width: "50%",
    flexDirection: "row",
  },
});
