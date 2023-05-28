import { StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "./src/pages/HomePage";
import GameMenu from "./src/pages/GameMenuPage";
import FreeBoard from "./src/pages/FreeBoardPage";
import LastGame from "./src/pages/LastGamePage";
import Login from "./src/pages/LoginPage";
import PlayBot from "./src/pages/PlayBotPage";
import PlayOnline from "./src/pages/PlayOnlinePage";
import PlayWithFriendsMenu from "./src/pages/PlayWithFriendsMenuPage";
import ProfilePage from "./src/pages/ProfilePage";
import Register from "./src/pages/RegisterPage";
import Socials from "./src/pages/SocialsPage";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { ColorsPallet } from "./src/utils/Constants";
import Header from "./src/components/Header";
import AnalyzeGame from "./src/pages/AnalyzeGamePage";
import { UserContext, User } from "./src/context/UserContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getUser } from "./src/services/userServices";

export type RootStackParamList = {
  Home: undefined;
  GameMenu: undefined;
  FreeBoard: undefined;
  LastGame: undefined;
  Login: undefined;
  PlayBot: undefined;
  PlayOnline: undefined;
  PlayWithFriendsMenu: {
    nick: string;
    rank: Number;
    active: boolean;
    playing: boolean;
  };
  ProfilePage: {
    nick: string;
    rank: Number;
    active?: boolean;
    playing?: boolean;
    avatar?: String;
  };
  Register: undefined;
  Socials: undefined;
  AnalyzeGame: undefined;
};

const basicUser: User = {
  name: "Wojtek",
  email: "Burek@gmail.com",
  country: "pl",
  ranking: 1500,
};

const Routing = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUser();
      setUser(data || basicUser);
    };

    fetchData();
  }, []);

  const [user, setUser] = useState<User>(basicUser);

  return (
    <UserContext.Provider value={basicUser}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomePage}
            options={{ ...headerOptions }}
          />
          <Stack.Screen
            name="GameMenu"
            component={GameMenu}
            options={{ ...headerOptions }}
          />
          <Stack.Screen
            name="FreeBoard"
            children={(
              props: NativeStackScreenProps<RootStackParamList, "FreeBoard">
            ) => <FreeBoard {...props} />}
            options={{ ...headerOptions }}
          />
          <Stack.Screen
            name="LastGame"
            component={LastGame}
            options={{ ...headerOptions }}
          />
          <Stack.Screen
            name="Login"
            children={(
              props: NativeStackScreenProps<RootStackParamList, "Login">
            ) => <Login {...props} setUser={setUser} />}
            options={{ ...headerOptions }}
          />
          <Stack.Screen
            name="PlayBot"
            component={PlayBot}
            options={{ ...headerOptions }}
          />
          <Stack.Screen
            name="PlayOnline"
            component={PlayOnline}
            options={{ ...headerOptions }}
          />
          <Stack.Screen
            name="PlayWithFriendsMenu"
            component={PlayWithFriendsMenu}
            options={{ ...headerOptions }}
          />
          <Stack.Screen
            name="ProfilePage"
            component={ProfilePage}
            options={{ ...headerOptions }}
          />
          <Stack.Screen
            name="Register"
            children={(
              props: NativeStackScreenProps<RootStackParamList, "Register">
            ) => <Register {...props} />}
            options={{ ...headerOptions }}
          />
          <Stack.Screen
            name="Socials"
            component={Socials}
            options={{ ...headerOptions }}
          />
          <Stack.Screen
            name="AnalyzeGame"
            component={AnalyzeGame}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: "100%",
    backgroundColor: ColorsPallet.darker,
  },
});

const headerOptions: NativeStackNavigationOptions = {
  headerStyle: styles.header,
  headerTitle: () => <Header console={() => console.log("profil")} />,
  
};

export default Routing;
