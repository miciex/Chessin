import { View, StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";

import { ColorsPallet } from "../utils/Constants";
import InputField from "../components/InputField";
import Friend from "../features/playWithFriend/components/Friend";
import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import Submit from "../features/login/components/Submit";
import {
  handleSearchBarSocials,
  setUserDataFromResponse,
} from "../services/userServices";
import { HandleSearchBarSocials } from "../utils/ServicesTypes";
import Animated, {
  BounceInUp,
  RollInLeft,
  SlideInLeft,
} from "react-native-reanimated";
import { getPagedUsers } from "../services/userServices";
import { ResponseUser, responseUserToUser } from "../utils/PlayerUtilities";
import { User } from "../utils/PlayerUtilities";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "Socials",
    undefined
  >;
  route: RouteProp<RootStackParamList, "Socials">;
};

export default function Socials({ route, navigation }: Props) {
  const [users, setUsers] = useState<Array<User>>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    if (searchValue)
      getPagedUsers(searchValue, 0)
        .then((data: null | ResponseUser[]) => {
          if (!data) return;
          setUsers(data.map((x) => responseUserToUser(x, "")));
        })
        .catch((error) => {
          throw new Error(error);
        });
  }, [searchValue]);

  return (
    <Animated.View style={styles.appContainer}>
      <View style={styles.formContainer}>
        <InputField
          placeholder="Search"
          onChange={(e) => {
            setSearchValue(e);
          }}
        />
        <ScrollView>
          <View style={styles.scrollView}>
            {users.map((gracz) => (
              <Friend user={gracz} navigation={navigation} />
            ))}
          </View>
        </ScrollView>
      </View>

      <Footer navigation={navigation} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 8,
    alignItems: "center",
    backgroundColor: ColorsPallet.light,
    width: "90%",
  },
  appContainer: {
    backgroundColor: ColorsPallet.light,
    flex: 1,
    alignContent: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    alignItems: "center",
    marginLeft: "5%",
    width: "90%",
  },
});
