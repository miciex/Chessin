import { View, Text, StyleSheet, Animated } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { ColorsPallet } from "../../../utils/Constants";
import { FontAwesome } from "@expo/vector-icons";

export default function WaitingForGame() {
  const translateY = useRef(new Array(5)).current;
  const [circles, setCircles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const animations = [];
    console.log("animations");
    for (let i = 0; i < translateY.length; i++) {
      translateY[i] = new Animated.Value(0);
      animations.push(
        Animated.sequence([
          Animated.timing(translateY[i], {
            toValue: -40,
            duration: 250 + i * 100,
            useNativeDriver: true,
          }),
          Animated.timing(translateY[i], {
            toValue: 0,
            duration: 250 + i * 100,
            useNativeDriver: true,
          }),
        ])
      );
    }

    Animated.loop(Animated.parallel(animations)).start();

    setCircles(
      translateY.map((item, index) => {
        return (
          <Animated.View
            style={[{ transform: [{ translateY: item }] }, { zIndex: 100 }]}
            key={index}
          >
            <FontAwesome name="circle" size={24} color="black" />
          </Animated.View>
        );
      })
    );
  }, []);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View>
          <Text>Waiting For Game</Text>
        </View>
        <View style={styles.circlesContainer}>{circles}</View>
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
  },
  container: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    backgroundColor: ColorsPallet.light,
    opacity: 0.8,
    justifyContent: "center",
    gap: 32,
    alignItems: "center",
  },
  circlesContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    height: 50,
  },
});
