import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "./src/pages/HomePage";
import GameMenu from "./src/pages/GameMenuPage";
import FreeBoard from "./src/pages/FreeBoardPage";
import LastGame from "./src/pages/LastGamePage";
import Login from "./src/pages/LoginPage";
import PlayBot from "./src/pages/PlayBotPage";
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
import Friends from "./src/pages/Friends";
import { User } from "./src/utils/PlayerUtilities";
import { fetchandStoreUser } from "./src/features/authentication/services/loginServices";
import { remindPassword } from "./src/services/AuthenticationServices";
import RemindPasswordPage from "./src/pages/RemindPasswordPage";
import UserNotAuthenticatedPage from "./src/pages/UserNotAuthenticatedPage";
import { UserLoggedInContext } from "./src/features/context/userloggedInContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "./src/utils/Constants";
import NotAuthenticatedHeader from "./src/components/NotAuthenticatedHeader";
import { getValueFor, save } from "./src/utils/AsyncStoreFunctions";

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
  PlayWithFriendsMenu: {
    userArg: User;
  };
  ProfilePage:
    | {
        nameInGame: string;
      }
    | undefined;
  Friends: {
    nameInGame: string;
  };
  Register: undefined;
  Socials: undefined;
  AnalyzeGame: { gameId: number };
  Notification: undefined;
  ResetPassword: undefined;
  RemindPassword: undefined;
  UserNotAuthenticated: undefined;
};

const refreshTokenInterval = 1000 * 60 * 14;

const Routing = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const netInfo = useNetInfo();

  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const setUserAuthenticated = () => {
    setAuthenticated(true);
  };

  const setUserNotAuthenticated = () => {
    setAuthenticated(false);
  };

  useEffect(() => {
    setUserActive(netInfo.isConnected ? true : false).catch((err) => {
      throw new Error(err);
    });
  }, [netInfo.isConnected]);

  useEffect(() => {
    resetAccessToken()
      .then(() => {
        fetchandStoreUser().then(()=>{
          setUserAuthenticated();
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
    const resetToken = setInterval(() => {
      resetAccessToken().catch((err) => {
        throw new Error(err);
      });
    }, refreshTokenInterval);
    return () => {
      clearInterval(resetToken);
      save("user", "");
    };
  }, []);

  const getHeader = (
    navigation: NativeStackNavigationProp<
      RootStackParamList,
      StackParamList,
      undefined
    >
  ) => {
    return authenticated ? (
      <Header navigation={navigation} />
    ) : (
      <NotAuthenticatedHeader />
    );
  };

  return (
    <UserLoggedInContext.Provider value={authenticated}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={authenticated ? "Home" : "UserNotAuthenticated"}
        >
          <Stack.Screen
            name="Home"
            children={(
              props: NativeStackScreenProps<RootStackParamList, "Home">
            ) => (
              <HomePage {...props} setUserAuthenticated={setUserAuthenticated} />
            )}
            options={({ navigation }) => ({
              headerStyle: styles.header,
              headerTitle: () => getHeader(navigation),
              headerBackVisible: false
            })}
          />
          <Stack.Screen
            name="GameMenu"
            component={GameMenu}
            options={({ navigation }) => ({
              headerStyle: styles.header,
              headerTitle: () => getHeader(navigation),
            })}
          />
          <Stack.Screen
            name="FreeBoard"
            children={(
              props: NativeStackScreenProps<RootStackParamList, "FreeBoard">
            ) => <FreeBoard {...props} />}
            options={({ navigation }) => ({
              headerStyle: styles.header,
              headerTitle: () => getHeader(navigation),
            })}
          />
          <Stack.Screen
            name="LastGame"
            component={LastGame}
            options={({ navigation }) => ({
              headerStyle: styles.header,
              headerTitle: () => getHeader(navigation),
            })}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={({ navigation }) => ({
              headerStyle: styles.header,
              headerTitle: () => getHeader(navigation),
            })}
          />
          <Stack.Screen
            name="PlayBot"
            component={PlayBot}
            options={({ navigation }) => ({
              headerStyle: styles.header,
              headerTitle: () => getHeader(navigation),
            })}
          />
          <Stack.Screen
            name="PlayOnline"
            component={PlayOnline}
            options={({ navigation }) => ({
              headerStyle: styles.header,
              headerTitle: () => getHeader(navigation),
            })}
          />
          <Stack.Screen
            name="PlayWithFriendsMenu"
            component={PlayWithFriendsMenu}
            options={({ navigation }) => ({
              headerStyle: styles.header,
              headerTitle: () => getHeader(navigation),
            })}
          />
          <Stack.Screen
            name="ProfilePage"
            children={(
              props: NativeStackScreenProps<RootStackParamList, "ProfilePage">
            ) => (
              <ProfilePage
                {...props}
                setUserNotAuthenticated={setUserNotAuthenticated}
              />
            )}
            options={({ navigation }) => ({
              headerStyle: styles.header,
              headerTitle: () => getHeader(navigation),
            })}
          />
          <Stack.Screen
            name="Notification"
            component={NotificationPage}
            options={({ navigation }) => ({
              headerStyle: styles.header,
              headerTitle: () => getHeader(navigation),
            })}
          />
          <Stack.Screen
            name="Register"
            children={(
              props: NativeStackScreenProps<RootStackParamList, "Register">
            ) => <Register {...props} />}
            options={({ navigation }) => ({
              headerStyle: styles.header,
              headerTitle: () => getHeader(navigation),
            })}
          />
          <Stack.Screen
            name="Socials"
            component={Socials}
            options={({ navigation }) => ({
              headerStyle: styles.header,
              headerTitle: () => getHeader(navigation),
            })}
          />
          <Stack.Screen
            name="Friends"
            component={Friends}
            options={({ navigation }) => ({
              headerStyle: styles.header,
              headerTitle: () => getHeader(navigation),
            })}
          />
          <Stack.Screen
            name="AnalyzeGame"
            component={AnalyzeGame}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ResetPassword"
            children={(
              props: NativeStackScreenProps<RootStackParamList, "ResetPassword">
            ) => (
              <ResetPasswordPage
                {...props}
                setUserNotAuthenticated={setUserNotAuthenticated}
              />
            )}
            options={({ navigation }) => ({
              headerStyle: styles.header,
              headerTitle: () => getHeader(navigation),
            })}
          />
          <Stack.Screen
            name="RemindPassword"
            children={(
              props: NativeStackScreenProps<
                RootStackParamList,
                "RemindPassword"
              >
            ) => (
              <RemindPasswordPage
                {...props}
                setUserNotAuthenticated={setUserNotAuthenticated}
              />
            )}
            options={({ navigation }) => ({
              headerStyle: styles.header,
              headerTitle: () => getHeader(navigation),
            })}
          />
          <Stack.Screen
            name="UserNotAuthenticated"
            component={UserNotAuthenticatedPage}
            options={({ navigation }) => ({
              headerStyle: styles.header,
              headerTitle: () => <NotAuthenticatedHeader />,
              headerBackVisible: false,
              headerLeft: ()=> null
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserLoggedInContext.Provider>
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
