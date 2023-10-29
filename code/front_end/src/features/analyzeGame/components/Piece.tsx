import React, { useRef } from "react";
import { Animated, Dimensions, PanResponder } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { AnalyzeGameAction, AnalyzeGameState } from "../reducers/AnalyzeGameReducer";
import {
  GameResults,
  possibleMovesAfterCheck,
} from "../../../chess-logic/board";
import { Move, moveFactory } from "../../../chess-logic/move";
import { BoardResponse, SubmitMoveRequest } from "../../../utils/ServicesTypes";
import { updateUserRating } from "../../../services/userServices";
import { mapToBoard } from "../../../chess-logic/helpMethods";

const yellow = "rgba(255, 255, 0, 0.5)";
type pos = { x: number; y: number };
const SIZE = Dimensions.get("window").width / 8;
const PIECE_SIZE = SIZE * 0.5;

const convertToIcon = (piece: Number) => {
  switch (piece) {
    case 17:
      return <FontAwesome5 name="chess-king" size={PIECE_SIZE} color="black" />;
    case 22:
      return (
        <FontAwesome5 name="chess-queen" size={PIECE_SIZE} color="black" />
      );
    case 19:
      return <FontAwesome5 name="chess-rook" size={PIECE_SIZE} color="black" />;
    case 21:
      return (
        <FontAwesome5 name="chess-bishop" size={PIECE_SIZE} color="black" />
      );
    case 20:
      return (
        <FontAwesome5 name="chess-knight" size={PIECE_SIZE} color="black" />
      );
    case 18:
      return <FontAwesome5 name="chess-pawn" size={PIECE_SIZE} color="black" />;
    case 9:
      return <FontAwesome5 name="chess-king" size={PIECE_SIZE} color="white" />;
    case 14:
      return (
        <FontAwesome5 name="chess-queen" size={PIECE_SIZE} color="white" />
      );
    case 11:
      return <FontAwesome5 name="chess-rook" size={PIECE_SIZE} color="white" />;
    case 13:
      return (
        <FontAwesome5 name="chess-bishop" size={PIECE_SIZE} color="white" />
      );
    case 12:
      return (
        <FontAwesome5 name="chess-knight" size={PIECE_SIZE} color="white" />
      );
    case 10:
      return <FontAwesome5 name="chess-pawn" size={PIECE_SIZE} color="white" />;
    default:
      return null;
  }
};

type Props = {
  id: number;
  position: pos;
  state: AnalyzeGameState;
  dispatch: React.Dispatch<AnalyzeGameAction>;
  activeValues: React.MutableRefObject<Animated.Value[]>;
  possibleMoves: React.MutableRefObject<Animated.Value[]>;
  positionNumber: number;
  resetActiveValues: () => void;
  resetPossibleMoves: () => void;
  ableToMove: boolean;
  rotateBoard: boolean;
};

export default function Piece({
  id,
  position,
  state,
  dispatch,
  activeValues,
  possibleMoves,
  positionNumber,
  resetActiveValues,
  resetPossibleMoves,
  ableToMove,
  rotateBoard,
}: Props) {
  // const translate = new Animated.ValueXY({ x: position.x, y: position.y });
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const panCut = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const findActiveValue = (): number => {
    for (let i = 0; i < 64; i++) {
      if (Number(JSON.stringify(activeValues.current[i])) === 1) {
        return i;
      }
    }
    return -1;
  };

  const setValueActive = (id: number) => {
    for (let i = 0; i < 64; i++) {
      if (i === id) {
        activeValues.current[i].setValue(1);
      } else {
        activeValues.current[i].setValue(0);
      }
    }
  };


  const isPossibleMove = (id: number): boolean => {
    if (Number(JSON.stringify(possibleMoves.current[id])) === 1) return true;
    return false;
  };

 

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => true,
      onPanResponderStart() {
        if (isPossibleMove(positionNumber) ) {

          resetActiveValues();
          resetPossibleMoves();

          panCut.setValue({ x: 0, y: 0 });
        } else if (id !== 0) {
          setValueActive(positionNumber);
        }
      },
      onPanResponderMove(_, gestureState) {
        pan.setValue({ x: gestureState.dx, y: gestureState.dy });
        panCut.setValue({
          x: Math.round(gestureState.dx / SIZE) * SIZE,
          y: Math.round(gestureState.dy / SIZE) * SIZE,
        });
      },
      onPanResponderRelease: (_, gestureState) => {

        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
        panCut.setValue({ x: 0, y: 0 });
        if (id !== 0) setValueActive(positionNumber);
      },
    })
  ).current;

  return (
    <>
      {id !== 0 ? (
        <Animated.View
          style={[
            {
              position: "absolute",
              width: SIZE,
              height: SIZE,
              zIndex: Animated.multiply(
                activeValues.current[positionNumber],
                10
              ),
              opacity:
                activeValues.current[
                  Math.round(position.x / SIZE) +
                    Math.round(position.y / SIZE) * 8
                ],
              backgroundColor: yellow,
              left: Animated.add(panCut.x, position.x).interpolate({
                inputRange: [0, 7 * SIZE],
                outputRange: [0, 7 * SIZE],
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              top: Animated.add(panCut.y, position.y).interpolate({
                inputRange: [0, 7 * SIZE],
                outputRange: [0, 7 * SIZE],
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            },
          ]}
        />
      ) : null}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: SIZE,
            height: SIZE,
            left: position.x,
            top: position.y,
            zIndex: Animated.multiply(activeValues.current[positionNumber], 10),
            opacity: activeValues.current[positionNumber],
            backgroundColor: yellow,
          },
        ]}
      />
      <Animated.View
        style={[
          {
            position: "absolute",
            width: SIZE,
            height: SIZE,
            left: Animated.add(pan.x, position.x).interpolate({
              inputRange: [0, 7 * SIZE],
              outputRange: [0, 7 * SIZE],
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            top: Animated.add(pan.y, position.y).interpolate({
              inputRange: [0, 7 * SIZE],
              outputRange: [0, 7 * SIZE],
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            zIndex: Animated.multiply(
              activeValues.current[positionNumber],
              100
            ),
            justifyContent: "center",
            alignItems: "center",
          },
          ,
        ]}
        {...panResponder.panHandlers}
      >
        <Animated.View
          style={{
            position: "absolute",
            width: SIZE / 2,
            height: SIZE / 2,
            backgroundColor: "#add8e6",
            borderRadius: SIZE / 2,
            zIndex: Animated.multiply(
              possibleMoves.current[positionNumber],
              11
            ),
            opacity: possibleMoves.current[positionNumber],
          }}
        />
        {id !== 0 ? convertToIcon(id) : null}
      </Animated.View>
    </>
  );
}
