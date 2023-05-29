import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { FieldInfo } from "../features/playOnline";
import ChessBoardField from "./ChessBoardField";
import Board, { constructorArgs } from "../utils/chess-calculations/board";
import { Move } from "../utils/chess-calculations/move";
import { ColorsPallet } from "../utils/Constants";

type Props = {
  board: Board;
  setBoard: (board: Board) => void;
};

export default function ChessBoard({ board, setBoard }: Props) {
  const [activeField, setActiveField] = useState(-1);

  const [possibleMoves, setPossibleMoves] = useState([-1]);

  const handleFieldPress = (data: FieldInfo) => {
    console.log("cos");
    console.log(data);

    //copy is needed for selection of fields
    setPossibleMoves(board.PossibleMoves(data.fieldNumber));
    copyPossibleMoves = [...possibleMoves];

    //if your white, its whites turn and you clicked on a white piece or the same with black
    if (
      (board.isWhite(data.fieldNumber) && board.whiteToMove) ||
      board.isWhite(data.fieldNumber) !== board.whiteToMove
    ) {
      setActiveField(data.fieldNumber);
      return;
    } else if (possibleMoves.includes(data.fieldNumber)) {
      const brd = new Board({ board });

      brd.movePiece(
        new Move({
          pieces: brd.position,
          startField: activeField,
          endField: data.fieldNumber,
        })
      );

      setBoard(brd);
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
