import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
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
import { ColorsPallet } from "./src/utils/Constants";
import Header from "./src/components/Header";
import AnalyzeGame from "./src/pages/AnalyzeGamePage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNetInfo } from "@react-native-community/netinfo";
import { setUserActive, resetAccessToken } from "./src/services/userServices";

export type RootStackParamList = {
  Home: undefined;
  GameMenu: undefined;
  FreeBoard: undefined;
  LastGame: undefined;
  Login: undefined;
  PlayBot: undefined;
  PlayOnline: undefined;
  PlayWithFriendsMenu: {};
  ProfilePage: undefined;
  Register: undefined;
  Socials: undefined;
  AnalyzeGame: undefined;
};

const refreshTokenInterval = 1000 * 60 * 14;
const checkNetInfoInterval = 1000 * 60;

const Routing = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const netInfo = useNetInfo();

  useEffect(() => {
    const setNetInfo = setInterval(() => {
      console.log("isConnected: ", netInfo.isConnected);
      setUserActive(netInfo.isConnected ? true : false);
    }, checkNetInfoInterval);
    const resetToken = setInterval(() => {
      resetAccessToken();
    }, refreshTokenInterval);
    return () => {
      console.log("clearing intervals");
      clearInterval(setNetInfo);
      clearInterval(resetToken);
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={({ navigation }) => ({
            headerStyle: styles.header,
            headerTitle: () => <Header navigation={navigation} />,
          })}
        />
        <Stack.Screen
          name="GameMenu"
          component={GameMenu}
          options={({ navigation }) => ({
            headerStyle: styles.header,
            headerTitle: () => <Header navigation={navigation} />,
          })}
        />
        <Stack.Screen
          name="FreeBoard"
          children={(
            props: NativeStackScreenProps<RootStackParamList, "FreeBoard">
          ) => <FreeBoard {...props} />}
          options={({ navigation }) => ({
            headerStyle: styles.header,
            headerTitle: () => <Header navigation={navigation} />,
          })}
        />
        <Stack.Screen
          name="LastGame"
          component={LastGame}
          options={({ navigation }) => ({
            headerStyle: styles.header,
            headerTitle: () => <Header navigation={navigation} />,
          })}
        />
        <Stack.Screen
          name="Login"
          children={(
            props: NativeStackScreenProps<RootStackParamList, "Login">
          ) => <Login {...props} />}
          options={({ navigation }) => ({
            headerStyle: styles.header,
            headerTitle: () => <Header navigation={navigation} />,
          })}
        />
        <Stack.Screen
          name="PlayBot"
          component={PlayBot}
          options={({ navigation }) => ({
            headerStyle: styles.header,
            headerTitle: () => <Header navigation={navigation} />,
          })}
        />
        <Stack.Screen
          name="PlayOnline"
          component={PlayOnline}
          options={({ navigation }) => ({
            headerStyle: styles.header,
            headerTitle: () => <Header navigation={navigation} />,
          })}
        />
        <Stack.Screen
          name="PlayWithFriendsMenu"
          component={PlayWithFriendsMenu}
          options={({ navigation }) => ({
            headerStyle: styles.header,
            headerTitle: () => <Header navigation={navigation} />,
          })}
        />
        <Stack.Screen
          name="ProfilePage"
          component={ProfilePage}
          options={({ navigation }) => ({
            headerStyle: styles.header,
            headerTitle: () => <Header navigation={navigation} />,
          })}
        />
        <Stack.Screen
          name="Register"
          children={(
            props: NativeStackScreenProps<RootStackParamList, "Register">
          ) => <Register {...props} />}
          options={({ navigation }) => ({
            headerStyle: styles.header,
            headerTitle: () => <Header navigation={navigation} />,
          })}
        />
        <Stack.Screen
          name="Socials"
          component={Socials}
          options={({ navigation }) => ({
            headerStyle: styles.header,
            headerTitle: () => <Header navigation={navigation} />,
          })}
        />
        <Stack.Screen
          name="AnalyzeGame"
          component={AnalyzeGame}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: "100%",
    backgroundColor: ColorsPallet.darker,
  },
});

export default Routing;
