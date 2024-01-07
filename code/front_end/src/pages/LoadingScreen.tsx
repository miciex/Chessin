import { View, Text, Animated, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { getValueFor, save } from "../utils/AsyncStoreFunctions";
import { resetAccessToken } from "../services/userServices";
import { fetchandStoreUser } from "../features/authentication/services/loginServices";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Routing";
import { RouteProp } from "@react-navigation/native";
import { User } from "../utils/PlayerUtilities";
import { Easing } from "react-native-reanimated";
import { NumberToPiece } from "../features/playOnline/components/NumberToPiece";
import { ColorsPallet } from "../utils/Constants";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "LoadingScreen",
    undefined
  >;
  route: RouteProp<RootStackParamList, "LoadingScreen">;
  setUserNotAuthenticated: () => void;
  setUserAuthenticated: () => void;
};
export default function LoadingScreen({
  navigation,
  setUserNotAuthenticated,
  setUserAuthenticated,
}: Props) {
  const [figure, setFigure] = useState<JSX.Element>();
  const translateY = useRef(new Animated.Value(0)).current;
  const spinValue = useRef(new Animated.Value(0)).current;

  const redirectUserToGame = async (user?: User) => {
    console.log("user");
    const accepted = await getValueFor("termsOfServiceAccepted").catch(() => {
      navigation.navigate("TermsOfService");
      throw new Error("Error while getting terms of service");
    });

    if (!accepted) {
      return navigation.navigate("TermsOfService");
    }
    if (user) {
      return navigation.navigate("Home");
    } else {
      return navigation.navigate("UserNotAuthenticated");
    }
  };

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 600,
          easing: Easing.cubic,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(spinValue, {
          toValue: 0,
          duration: 600,
          easing: Easing.cubic,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(spinValue, {
          toValue: -1,
          duration: 600,
          easing: Easing.cubic,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(spinValue, {
          toValue: 0,
          duration: 600,
          easing: Easing.cubic,
          useNativeDriver: true,
        }),
      ]),
    ]);

    Animated.loop(animation).start();

    const spin = spinValue.interpolate({
      inputRange: [-1, 1],
      outputRange: ["-45deg", "45deg"],
    });
    setFigure(
      <Animated.View
        style={[
          { transform: [{ translateY: translateY }, { rotate: spin }] },
          { zIndex: 100 },
        ]}
      >
        <NumberToPiece piece={20} pieceSize={100} />
      </Animated.View>
    );
  }, []);

  useEffect(() => {
    resetAccessToken()
      .then(() => {
        fetchandStoreUser()
          .then((user) => {
            setUserAuthenticated();
            redirectUserToGame(user).catch(() => {
              throw new Error("Error while redirecting user to game");
            });
          })
          .catch(() => {
            throw new Error("Error while fetching and storing user");
          });
      })
      .catch((err) => {
        save("user", "").catch(() => {
          throw new Error("Error while saving user");
        });
        redirectUserToGame();
        setUserNotAuthenticated();
        throw new Error(err);
      });
  }, []);

  return (
    <View style={styles.outerContainer}>
      <View>{figure}</View>
      <View style={styles.textContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
    height: "100%",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    position: "absolute",
    top: 0,
    backgroundColor: ColorsPallet.lighter,
  },
  textContainer: {
    marginTop: 32,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
