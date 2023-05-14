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
import { PlayColorsContext } from "../features/gameMenuPage/context/PlayColorContext";
import ChooseTimeButton from "../features/gameMenuPage/components/ChooseTimeButton";
import { GameLengthTypeContextType } from "../features/gameMenuPage/context/GameLengthContext";
import { LengthType } from "../features/gameMenuPage/context/GameLengthContext";
import TimeOptionsModal from "../features/gameMenuPage/components/TimeOptionsModal";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "PlayWithFriendsMenu",
    undefined
  >;

  route: RouteProp<RootStackParamList, "PlayWithFriendsMenu">;
};


export default function PlayWithFriendsMenuPage({ navigation, route }: Props) {


 

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const [chosenColor, setChosenColor] =
    useState<PlayColorsContextType>("random");
    const handleOpenModal = () => {
      setIsModalOpen(true);
    };
  
    const [gameTempo, setGameTempo] = useState<LengthType>({
      lengthType: GameLengthTypeContextType.BLITZ,
      totalTime: 180,
      increment: 0,
    });
    const handleGameTempoChange = (tempo: LengthType) => {
      setGameTempo(tempo);
    };
  
  const [timerModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { nick, active, playing, rank } = route.params;

  const [isEnabled, setIsEnabled] = useState(true);
  const [text, setText] = useState("Nothing here");

  const toggleSwitch = () => {
    if (isEnabled) setText("Rankingowa gra");
    else if (!isEnabled) setText("Nierankingowa gra");
    setIsEnabled(!isEnabled);
  };

  return (
    <View>
    <PlayColorsContext.Provider value={chosenColor}>
      <View style={styles.appContainer}>
        {timerModalOpen? (<TimeOptionsModal
            handleCloseModal={handleCloseModal}
            handleGameTempoChange={handleGameTempoChange}
          />): (
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
            <View style={{ width: 400, height: 130 }}>
              <ChooseTimeButton 
              handleOpenModal={handleOpenModal}
              tempo={gameTempo}
             />
            </View>
            
           
            <View style={{ width: 200, height: 60,  transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], }}>
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
                  transform: [{ scaleX: 1.15 }, { scaleY: 1.15 }],
                }}
              >
                <BaseCustomContentButton
                  handlePress={() => {toggleSwitch()}}
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
                onTouchMove={toggleSwitch}
              />
            </View>
            <View style={{ width: "80%", height: 80 }}>
            <BaseButton handlePress={() => {}} text="Graj" fontSizeProps={30} />
            </View>
          </View>
            
          </View>
          )}
        
          
        <Footer navigation={navigation} />
      </View>
    </PlayColorsContext.Provider>
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
    marginTop: 22,
    flex: 8,
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    fontSize: 24,
    lineHeight: 36,
  },
  buttonsContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
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
