import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Modal,
} from "react-native";
import React, { useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
<FontAwesome5 name="medal" size={24} color="black" />;
import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import Profile from "../features/playWithFriend/components/Profile";
import { ColorsPallet } from "../utils/Constants";
import PickColor from "../features/gameMenuPage/components/PickColor";
import BaseButton from "../components/BaseButton";
import { PlayColorsContextType } from "../features/gameMenuPage/context/PlayColorContext";
import BaseCustomContentButton from "../components/BaseCustomContentButton";
import BaseModal from "../components/BaseModal";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "PlayWithFriendsMenu",
    undefined
  >;

  route: RouteProp<RootStackParamList, "PlayWithFriendsMenu">;
};

export default function PlayWithFriendsMenuPage({ navigation, route }: Props) {
  const [chosenColor, setChosenColor] =
    useState<PlayColorsContextType>("random");

  const setColor = (colorType: PlayColorsContextType) => {
    setChosenColor(colorType);
  };

  const { nick, active, playing, rank } = route.params;

  const [isEnabled, setIsEnabled] = useState(true);
  const [text, setText] = useState("Nothing here");

  const toggleSwitch = () => {
    if (isEnabled) setText("Rankingowa gra");
    else if (!isEnabled) setText("Nierankingowa gra");
    setIsEnabled(!isEnabled);
  };

  return (
    <View style={styles.appContainer}>
      <View style={styles.contentContainer}>
        <View
          style={{
            width: "90%",
            height: 200,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Profile nick={nick} rank={rank} />
        </View>

        <View style={styles.timer}>
          <TouchableOpacity>
            <Text style={styles.text}>10:00</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonsContainer}>
          <View style={{ width: 200, height: 60 }}>
            <PickColor handleOnClick={setChosenColor} />
          </View>
          <View style={styles.rightButtons}>
            <View
              style={{
                width: 60,
                height: 60,
                backgroundColor: ColorsPallet.baseColor,
                padding: 5,
                borderRadius: 8,
              }}
            >
              <BaseCustomContentButton
                handlePress={() => {}}
                content={
                  <FontAwesome5
                    name="medal"
                    size={44}
                    color={() => {
                      console.log("cos");
                      if (isEnabled) return "white";
                      else if (!isEnabled) return "black";
                    }}
                  />
                }
              />
            </View>
            <Switch
              style={styles.switch}
              trackColor={{ false: "grey", true: "orange" }}
              thumbColor={"#f4f3f4"}
              ios_backgroundColor={"grey"}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>
        <View style={{ width: "80%", height: 80 }}>
          <BaseButton handlePress={() => {}} text="Graj" fontSizeProps={30} />
          <Text>
            <Modal />;
          </Text>
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
    marginTop: 32,
    flex: 8,
    alignItems: "center",
  },
  timer: {
    width: "70%",
    height: 60,
    backgroundColor: "grey",
    padding: 10,
    borderRadius: 6,
    marginBottom: 30,
  },
  text: {
    textAlign: "center",
    fontSize: 24,
    lineHeight: 36,
  },
  buttonsContainer: {
    alignItems: "center",
  },
  switch: {
    marginLeft: 30,
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
  rightButtons: {
    marginTop: 30,
    marginBottom: 30,
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
