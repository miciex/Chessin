import React, { useRef } from "react";
import { Animated, Dimensions, PanResponder } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  PlayOnlineAction,
  PlayOnlineState,
} from "../reducers/PlayOnlineReducer";
import { possibleMovesAfterCheck } from "../../../chess-logic/board";
import { Move, moveFactory } from "../../../chess-logic/move";
import { BoardResponse, SubmitMoveRequest } from "../../../utils/ServicesTypes";
import { listenForMove, submitMove } from "../services/playOnlineService";
import { NumberToPiece } from "./NumberToPiece";

const yellow = "rgba(255, 255, 0, 0.5)";
type pos = { x: number; y: number };
const SIZE = Dimensions.get("window").width / 8;
const PIECE_SIZE = SIZE * 0.5;

type Props = {
  id: number;
  position: pos;
  state: PlayOnlineState;
  dispatch: React.Dispatch<PlayOnlineAction>;
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

  const isMyTurn =
    (state.myPlayer.color === "white") === state.board.whiteToMove;

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

  const setPossibleMoves = (moves: number[]) => {
    if (
      (state.myPlayer.color === "white" && id > 16) ||
      (state.myPlayer.color === "black" && id < 16) ||
      id === 0
    )
      resetPossibleMoves();
    else
      for (let i = 0; i < 64; i++) {
        if (moves.includes(i)) {
          possibleMoves.current[i].setValue(1);
        } else {
          possibleMoves.current[i].setValue(0);
        }
      }
  };

  const isPossibleMove = (id: number): boolean => {
    if (Number(JSON.stringify(possibleMoves.current[id])) === 1) return true;
    return false;
  };

  const handleMove = (move: Move) => {
    const submitMoveRequest: SubmitMoveRequest = {
      gameId: state.gameId,
      movedPiece: move.movedPiece,
      startField: move.startField,
      endField: move.endField,
      promotePiece: move.promotePiece,
    };
    submitMove(submitMoveRequest)
      .then((boardResponse: BoardResponse) => {
        if (!boardResponse) return;
        dispatch({
          type: "setDataFromBoardResponse",
          payload: { boardResponse },
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
    dispatch({
      type: "playMove",
      payload: move,
    });
    dispatch({ type: "updateMyClockByMilliseconds", payload: state.increment });
    if (state.board.moves.length === 0)
      dispatch({ type: "setCurrentPosition", payload: 0 });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => true,
      onPanResponderStart() {
        const activeField = findActiveValue();
        if (isPossibleMove(positionNumber) && isMyTurn) {
          if (ableToMove) {
            const move = moveFactory({
              pieces: state.board.position,
              startField: rotateBoard ? 63 - activeField : activeField,
              endField: rotateBoard ? 63 - positionNumber : positionNumber,
            });
            handleMove(move);
          }

          resetActiveValues();
          resetPossibleMoves();

          panCut.setValue({ x: 0, y: 0 });
        } else if (id !== 0) {
          const possibleMoves = possibleMovesAfterCheck(
            rotateBoard ? 63 - positionNumber : positionNumber,
            state.board
          ).map((possibleMove) =>
            rotateBoard ? 63 - possibleMove : possibleMove
          );
          setValueActive(positionNumber);
          setPossibleMoves(possibleMoves);
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
        const endField =
          Math.round((position.x + gestureState.dx) / SIZE) +
          Math.round((position.y + gestureState.dy) / SIZE) * 8;
        if (isPossibleMove(endField) && isMyTurn) {
          if (ableToMove) {
            const move = moveFactory({
              pieces: state.board.position,
              startField: rotateBoard ? 63 - positionNumber : positionNumber,
              endField: rotateBoard ? 63 - endField : endField,
            });

            handleMove(move);
            resetPossibleMoves();
            setValueActive(endField);
          } else resetPossibleMoves();
        }

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
        {id !== 0 ? <NumberToPiece piece={id} pieceSize={PIECE_SIZE} /> : null}
      </Animated.View>
    </>
  );
}
