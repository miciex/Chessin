import React, { useRef, useState } from "react";
import { Animated, Dimensions, PanResponder, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  PlayOnlineAction,
  PlayOnlineState,
} from "../reducers/PlayOnlineReducer";
import { possibleMovesAfterCheck } from "../../../chess-logic/board";
import { Move, moveFactory } from "../../../chess-logic/move";
import {
  BoardResponse,
  ListenForMoveRequest,
  SubmitMoveRequest,
} from "../../../utils/ServicesTypes";
import { listenForMove, submitMove } from "../services/playOnlineService";

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
  state: PlayOnlineState;
  dispatch: React.Dispatch<PlayOnlineAction>;
  activeValues: React.MutableRefObject<Animated.Value[]>;
  possibleMoves: React.MutableRefObject<Animated.Value[]>;
  positionNumber: number;
};

export default function Piece({
  id,
  position,
  state,
  dispatch,
  activeValues,
  possibleMoves,
  positionNumber,
}: Props) {
  // const translate = new Animated.ValueXY({ x: position.x, y: position.y });
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const panCut = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // const [possibleMoves, setPossibleMoves] = useState<number[]>([]);

  const resetActiveValues = () => {
    for (let i = 0; i < 64; i++) {
      activeValues.current[i].setValue(0);
    }
  };

  const findActiveValue = (id: number): number => {
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

  const isPieceActive = (id: number): boolean => {
    if (Number(JSON.stringify(activeValues.current[id])) === 1) return true;
    return false;
  };

  const resetPossibleMoves = () => {
    for (let i = 0; i < 64; i++) {
      possibleMoves.current[i].setValue(0);
    }
  };

  const findPossibleMoves = (id: number): number[] => {
    const moves: number[] = [];
    for (let i = 0; i < 64; i++) {
      if (Number(JSON.stringify(possibleMoves.current[i])) === 1) {
        moves.push(i);
      }
    }
    return moves;
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
      isDrawOffered: false,
    };
    dispatch({
      type: "playMove",
      payload: move,
    });
    submitMove(submitMoveRequest)
      .then((boardResponse: BoardResponse) => {
        dispatch({
          type: "setDataFromBoardResponse",
          payload: {
            boardResponse,
            myPlayer: state.myPlayer,
            opponent: state.opponent,
          },
        });
        console.log(boardResponse);
        listenForMove({
          gameId: state.gameId,
          moves: boardResponse.moves,
        })
          .then((res: BoardResponse | undefined) => {
            if (res === undefined) return;
            dispatch({
              type: "setDataFromBoardResponse",
              payload: {
                boardResponse,
                myPlayer: state.myPlayer,
                opponent: state.opponent,
              },
            });
          })
          .catch((err) => {
            throw new Error(err);
          });
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => true,
      onPanResponderStart(e, gestureState) {
        const activeField = findActiveValue(positionNumber);
        if (isPossibleMove(positionNumber)) {
          const move = moveFactory({
            pieces: state.board.position,
            startField: activeField,
            endField: positionNumber,
          });
          handleMove(move);

          resetActiveValues();
          resetPossibleMoves();

          panCut.setValue({ x: 0, y: 0 });
        } else if (id !== 0) {
          const possibleMoves = possibleMovesAfterCheck(
            positionNumber,
            state.board
          );
          setValueActive(positionNumber);
          setPossibleMoves(possibleMoves);
        }
      },
      onPanResponderMove(e, gestureState) {
        pan.setValue({ x: gestureState.dx, y: gestureState.dy });
        panCut.setValue({
          x: Math.round(gestureState.dx / SIZE) * SIZE,
          y: Math.round(gestureState.dy / SIZE) * SIZE,
        });
      },
      onPanResponderRelease: (e, gestureState) => {
        if (
          isPossibleMove(
            Math.round((position.x + gestureState.dx) / SIZE) +
              Math.round((position.y + gestureState.dy) / SIZE) * 8
          )
        ) {
          const move = moveFactory({
            pieces: state.board.position,
            startField: positionNumber,
            endField:
              Math.round((position.x + gestureState.dx) / SIZE) +
              Math.round((position.y + gestureState.dy) / SIZE) * 8,
          });
          handleMove(move);
          resetPossibleMoves();
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
        {id !== 0 ? convertToIcon(id) : null}
      </Animated.View>
    </>
  );
}
