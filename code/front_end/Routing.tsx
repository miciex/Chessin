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
// import PlayOnline from "./src/pages/PlayOnlinePage";
import PlayWithFriendsMenu from "./src/pages/PlayWithFriendsMenuPage";
import ProfilePage from "./src/pages/ProfilePage";
import Register from "./src/pages/RegisterPage";
import Socials from "./src/pages/SocialsPage";
import NotificationPage from "./src/pages/NotificationPage";
import { ColorsPallet } from "./src/utils/Constants";
import Header from "./src/components/Header";
import AnalyzeGame from "./src/pages/AnalyzeGamePage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNetInfo } from "@react-native-community/netinfo";
import { setUserActive, resetAccessToken } from "./src/services/userServices";
import { PendingChessGameRequest } from "./src/utils/ServicesTypes";
import ResetPasswordPage from "./src/pages/ResetPasswordPage";
import PlayOnline from "./src/pages/PlayOnline";

export type RootStackParamList = {
  Home: undefined;
  GameMenu: undefined;
  FreeBoard: undefined;
  LastGame: undefined;
  Login: undefined;
  PlayBot: undefined;
  PlayOnline: {
    request: PendingChessGameRequest;
  };
  PlayWithFriendsMenu: {};
  ProfilePage: undefined;
  Register: undefined;
  Socials: undefined;
  AnalyzeGame: undefined;
  Notification: undefined;
  ResetPassword: undefined;
};

const refreshTokenInterval = 1000 * 60 * 14;

const Routing = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const netInfo = useNetInfo();

  useEffect(() => {
    setUserActive(netInfo.isConnected ? true : false).catch((err) => {
      throw new Error(err);
    });
  }, [netInfo.isConnected]);

  useEffect(() => {
    resetAccessToken();
    const resetToken = setInterval(() => {
      resetAccessToken().catch((err) => {
        throw new Error(err);
      });
    }, refreshTokenInterval);
    return () => {
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
          name="Notification"
          component={NotificationPage}
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
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordPage}
          options={({ navigation }) => ({
            headerStyle: styles.header,
            headerTitle: () => <Header navigation={navigation} />,
          })}
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
