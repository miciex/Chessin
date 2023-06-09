import { View, StyleSheet } from "react-native";
import React, { useState, useMemo } from "react";
import { FieldInfo } from "..";
import ChessBoardField from "../../../components/ChessBoardField";
import {
  Board,
  PossibleMoves,
  isWhite,
  BoardResponseToBoard,
  deleteImpossibleMoves,
  copyBoard,
} from "../../../chess-logic/board";
import { moveFactory } from "../../../chess-logic/move";
import { ColorsPallet } from "../../../utils/Constants";
import { Player } from "../../../utils/PlayerUtilities";
import { submitMove } from "../services/playOnlineService";
import { Move } from "../../../chess-logic/move";
import { SubmitMoveRequest } from "../../../utils/ServicesTypes";
import { BoardResponse } from "../../../utils/ServicesTypes";
import { mapToBoard } from "../../../chess-logic/helpMethods";

type Props = {
  board: Board;
  setBoard: (board: Board) => void;
  player: Player;
  gameId: number;
  playMove: (move: Move) => void;
  setMyClockInfo: (timeLeft: Date) => void;
  setOpponentClockInfo: (timeLeft: Date) => void;
  setLastMoveDate: (date: Date) => void;
  currentPosition: number;
  setCurrentPosition: (position: number) => void;
  addIncrement: () => void;
};

export default function PlayOnlineChessBoard({
  board,
  setBoard,
  player,
  gameId,
  playMove,
  setMyClockInfo,
  setOpponentClockInfo,
  setLastMoveDate,
  currentPosition,
  setCurrentPosition,
  addIncrement,
}: Props) {
  const [activeField, setActiveField] = useState(-1);

  const [possibleMoves, setPossibleMoves] = useState([-1]);

  const handleFieldPress = (data: FieldInfo) => {
    if (currentPosition !== board.moves.length - 1) {
      setCurrentPosition(board.moves.length - 1);
      return;
    }

    const pm = PossibleMoves(data.fieldNumber, board);

    const dmp = deleteImpossibleMoves(pm, data.fieldNumber, copyBoard(board));
    setPossibleMoves(dmp);

    //if your white, its whites turn and you clicked on a white piece or the same with black
    if (
      data.fieldNumber in board.position &&
      isWhite(data.fieldNumber, board.position) === (player.color === "white")
    ) {
      setActiveField(data.fieldNumber);
      return;
    }
    if (
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
      movedPiece: board.position[activeField],
    });

    const submitMoveRequest: SubmitMoveRequest = {
      gameId: gameId,
      movedPiece: move.movedPiece,
      startField: move.startField,
      endField: move.endField,
      promotePiece: move.promotePiece,
      isDrawOffered: false,
    };
    playMove(move);
    setCurrentPosition(board.moves.length);

    submitMove(submitMoveRequest)
      .then((data: BoardResponse) => {
        if (!data) return;
        setBoard(BoardResponseToBoard(data));
        setMyClockInfo(
          new Date(player.color === "white" ? data.whiteTime : data.blackTime)
        );
        setOpponentClockInfo(
          new Date(player.color === "white" ? data.blackTime : data.whiteTime)
        );
        setLastMoveDate(new Date(data.lastMoveTime));
        setCurrentPosition(data.positions.length - 1);
        addIncrement();
      })
      .catch((error) => {
        throw error;
      });

    setActiveField(-1);
  };

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

    if (
      info.fieldNumber == activeField ||
      possibleMoves.includes(info.fieldNumber)
    ) {
      backgroundColor =
        backgroundColor == ColorsPallet.light
          ? ColorsPallet.baseColor
          : ColorsPallet.darker;
    }
  };

  const renderBoard = () => {
    const renderedBoard = [];
    const visualBoard =
      board.positions[currentPosition] !== undefined
        ? mapToBoard(board.positions[currentPosition])
        : board.visualBoard;
    for (let i = 0; i < 64; i++) {
      const number = player.color === "white" ? i : 63 - i;
      setBackgroundColor({
        piece: visualBoard[number],
        fieldNumber: number,
      });
      renderedBoard.push(
        <ChessBoardField
          key={number}
          info={{ piece: visualBoard[number], fieldNumber: number }}
          handleFieldPress={handleFieldPress}
          backgroundColor={backgroundColor}
        />
      );
    }

    return renderedBoard;
  };

  const renderedBoard = useMemo(
    () => renderBoard(),
    [board, activeField, possibleMoves, player.color, currentPosition]
  );

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
