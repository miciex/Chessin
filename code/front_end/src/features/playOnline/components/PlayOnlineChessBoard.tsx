import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { FieldInfo } from "..";
import ChessBoardField from "../../../components/ChessBoardField";
import {
  Board,
  PossibleMoves,
  boardFactory,
  isWhite,
  playMove,
  BoardResponseToBoard,
} from "../../../chess-logic/board";
import { moveFactory } from "../../../chess-logic/move";
import { ColorsPallet } from "../../../utils/Constants";
import { Player } from "../../../utils/PlayerUtilities";
import { submitMove } from "../services/playOnlineService";
import { Move } from "../../../chess-logic/move";
import { SubmitMoveRequest } from "../../../utils/ServicesTypes";
import { BoardResponse } from "../../../utils/ServicesTypes";

type Props = {
  board: Board;
  setBoard: (board: Board) => void;
  player: Player;
  gameId: number;
};

export default function PlayOnlineChessBoard({
  board,
  setBoard,
  player,
  gameId,
}: Props) {
  const [activeField, setActiveField] = useState(-1);

  const [possibleMoves, setPossibleMoves] = useState([-1]);

  const handleFieldPress = (data: FieldInfo) => {
    //copy is needed for selection of fields
    setPossibleMoves(PossibleMoves(data.fieldNumber, board));
    copyPossibleMoves = [...possibleMoves];

    //if your white, its whites turn and you clicked on a white piece or the same with black
    if (
      data.fieldNumber in board.position &&
      isWhite(data.fieldNumber, board.position) === (player.color === "white")
    ) {
      setActiveField(data.fieldNumber);
      return;
    } else if (
      possibleMoves.includes(data.fieldNumber) &&
      (player.color === "white") === board.whiteToMove
    ) {
      move(data);
    }

    setActiveField(-1);
    setPossibleMoves([]);
  };

  const move = (data: FieldInfo) => {
    const move: Move = moveFactory({
      pieces: board.position,
      startField: activeField,
      endField: data.fieldNumber,
    });

    const submitMoveRequest: SubmitMoveRequest = {
      gameId: gameId,
      email: player.email,
      movedPiece: move.movedPiece,
      startField: move.startField,
      endField: move.endField,
      promotePiece: move.promotePiece,
      isDrawOffered: false,
    };

    setBoard(playMove(move, board));

    submitMove(submitMoveRequest).then((data: BoardResponse) => {
      console.log("data returned");
      if (!data) return;
      setBoard(BoardResponseToBoard(data));
    });

    setActiveField(-1);
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