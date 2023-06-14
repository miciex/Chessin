import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, {useState} from "react";

import { ColorsPallet } from "../utils/Constants";
import SendInvitation from "../features/playWithFriend/components/SendInvitation";
import InputField from "../components/InputField";
import Friend from "../features/playWithFriend/components/Friend";
import Footer from "../components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import Submit from "../features/login/components/Submit";
import { handleSearchBarSocials, setUserDataFromResponse } from "../services/userServices";
import { HandleSearchBarSocials } from "../utils/ServicesTypes";
import { responseUser, responseUserToUser } from "../utils/PlayerUtilities";
import { User } from "../utils/PlayerUtilities";

const [friends, setFriends]= useState( [
  {
    nick: "Pusznik",
    rank: 1500,
    active: false,
    playing: false,
    avatar: "",
  },
  {
    nick: "MaciekNieBij",
    rank: 1500,
    active: true,
    playing: true,
    avatar: "",
  },
  {
    nick: "Slaweczuk",
    rank: 1500,
    active: true,
    playing: false,
    avatar: "",
  },
  {
    nick: "Strzała",
    rank: 1500,
    active: false,
    playing: false,
    avatar: "",
  },
  {
    nick: "Bestia",
    rank: 1500,
    active: false,
    playing: false,
    avatar: "",
  },
  { nick: "Sharku", rank: 1000, active: true, playing: true, avatar: "" },
  {
    nick: "Zocho",
    rank: 1300,
    active: false,
    playing: false,
    avatar: "",
  },
  {
    nick: "Strzała",
    rank: 1500,
    active: false,
    playing: false,
    avatar: "",
  },
  {
    nick: "Bestia",
    rank: 1500,
    active: false,
    playing: false,
    avatar: "",
  },
  { nick: "Sharku", rank: 1000, active: true, playing: true, avatar: "" },
  {
    nick: "Zocho",
    rank: 1300,
    active: false,
    playing: false,
    avatar: "",
  },
  {
    nick: "Strzała",
    rank: 1500,
    active: false,
    playing: false,
    avatar: "",
  },
  {
    nick: "Bestia",
    rank: 1500,
    active: false,
    playing: false,
    avatar: "",
  },
  { nick: "Sharku", rank: 1000, active: true, playing: true, avatar: "" },
  {
    nick: "Zocho",
    rank: 1300,
    active: false,
    playing: false,
    avatar: "",
  },
]);

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "Socials",
    undefined
  >;
  route: RouteProp<RootStackParamList, "Socials">;
};



export default function Socials({ route, navigation }: Props) {

  const [users, setUsers] = useState<Array<User>>([])

  const handleSearchBar = (searchBar: HandleSearchBarSocials) =>{
  handleSearchBarSocials(searchBar).then((data) =>{ 
    if(data === undefined) return
    setUsers(data.map(x => responseUserToUser(x, "")))
  })
  }

  
  return (
    <View style={styles.appContainer}>
      <View style={styles.formContainer}>
       
        <InputField placeholder="Search" onChange={e=>{handleSearchBar({searchNickname: e})}} />
        <ScrollView>
          <View style={styles.scrollView}>
            {friends.map((gracz) => (
              <Friend
                  user={gracz}
                  navigation={navigation}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      <Footer navigation={navigation} />
    </View>
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
