import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { FieldInfo } from "../features/playOnline";
import ChessBoardField from "./ChessBoardField";
import {
  Board,
  PossibleMoves,
  boardFactory,
  isWhite,
  playMove,
} from "../utils/chess-calculations/board";
import { Move, moveFactory } from "../utils/chess-calculations/move";
import { ColorsPallet } from "../utils/Constants";
import { Player } from "../utils/PlayerUtilities";

type Props = {
  board: Board;
  setBoard: (board: Board) => void;
  myPlayer: Player;
};

export default function ChessBoard({ board, setBoard, myPlayer }: Props) {
  const [activeField, setActiveField] = useState(-1);

  const [possibleMoves, setPossibleMoves] = useState([-1]);

  const handleFieldPress = (data: FieldInfo) => {
    //copy is needed for selection of fields
    console.log(board);
    setPossibleMoves(PossibleMoves(data.fieldNumber, board));
    copyPossibleMoves = [...possibleMoves];
    console.log(board);

    //if your white, its whites turn and you clicked on a white piece or the same with black
    if (
      data.fieldNumber in board.position &&
      isWhite(data.fieldNumber, board.position) === (myPlayer.color === "white")
    ) {
      setActiveField(data.fieldNumber);
      return;
    } else if (
      possibleMoves.includes(data.fieldNumber) &&
      (myPlayer.color === "white") === board.whiteToMove
    ) {
      board = playMove(
        moveFactory({
          pieces: board.position,
          startField: activeField,
          endField: data.fieldNumber,
        }),
        board
      );

      setBoard(board);
    }

    setActiveField(-1);
    setPossibleMoves([]);
  };

  let copyPossibleMoves: Number[] = [0];

  let backgroundColor: string;

  //defining the color of background
  //different for : white, black, active, possible move, possible move with piece
  const setBackgroundColor = (info: FieldInfo) => {
    //setting the background to white and black (normal chess board)
    backgroundColor =
      (info.fieldNumber % 2 === 0 &&
        Math.floor(info.fieldNumber / 8) % 2 === 0) ||
      (info.fieldNumber % 2 === 1 && Math.floor(info.fieldNumber / 8) % 2 === 1)
        ? ColorsPallet.light
        : ColorsPallet.dark;

    if (info.fieldNumber == activeField) {
      backgroundColor =
        backgroundColor == ColorsPallet.light
          ? ColorsPallet.baseColor
          : ColorsPallet.darker;
    } else if (info.fieldNumber == copyPossibleMoves[0]) {
      backgroundColor =
        backgroundColor == ColorsPallet.light
          ? ColorsPallet.baseColor
          : ColorsPallet.darker;
      copyPossibleMoves.shift();
    }
  };

  const renderBoard = () => {
    const renderedBoard = [];

    for (let i = 0; i < 64; i++) {
      setBackgroundColor({ piece: board.visualBoard[i], fieldNumber: i });
      renderedBoard.push(
        <ChessBoardField
          key={i}
          info={{ piece: board.visualBoard[i], fieldNumber: i }}
          handleFieldPress={handleFieldPress}
          backgroundColor={backgroundColor}
        />
      );
    }
    copyPossibleMoves = [];

    return renderedBoard;
  };
  possibleMoves.sort((a, b) => a - b);
  copyPossibleMoves = possibleMoves.filter((value) => value >= 0);

  const renderedBoard = renderBoard();

  return <View style={styles.container}>{renderedBoard}</View>;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flexWrap: "wrap",
    flexDirection: "row",
  },
});
