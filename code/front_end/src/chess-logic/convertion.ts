import { Move } from "./move"
import { Board,canMoveToSquare } from "./board"
import { Pieces } from "./ChessConstants";
import { intToCharPiece, fieldNumberToChessNotation } from "./helpMethods";
import { ALPHABET } from "../utils/Constants";


export const moveToChessNotation = (board: Board, move:Move) => {
    let note:string = "";
    if (move.movedPiece == Pieces.KING && move.endField - move.startField == 2) {
        note = "O-O";
    } else if (move.movedPiece == Pieces.KING && move.endField - move.startField == -2) {
        note = "O-O-O";
    } else if (move.movedPiece % 8 != 2) {
        note += (intToCharPiece(move.movedPiece)).toUpperCase();
    } else if (move.movedPiece == Pieces.PAWN) {
        for (let [key, value] of Object.entries(board.position)) {
            if (value != Pieces.PAWN && move.takenPiece == 0) continue;
            note += ALPHABET[move.startField % 8];
            break;
        }
    }

    if (move.movedPiece % 8 != Pieces.PAWN && move.movedPiece % 8 != Pieces.KING) {
        const fromWhereCouldMove:Array<number> = canMoveToSquare(move.startField, move.movedPiece, board.visualBoard,move.movedPiece);
        if (fromWhereCouldMove.length > 1) {
            let row:boolean = false;
            let col:boolean = false;
            for (let i of fromWhereCouldMove) {
                if (i % 8 == move.startField % 8) {
                    note += i / 8;
                    row = true;
                } else if (i / 8 == move.startField / 8) {
                    note += ALPHABET[i % 8];
                    break;
                }
            }
            // if (!row && col === true) {
            //     note += ALPHABET[move.startField % 8];
            // }
        }
    }

    if (move.takenPiece != 0) {
        if (move.movedPiece % 8 == Pieces.PAWN) {
            note += ALPHABET[move.startField % 8];
        }
        note += "x";

    }
    note += fieldNumberToChessNotation(move.endField);
    if (move.promotePiece != 0) {
        note += "=" + (intToCharPiece(move.promotePiece)).toUpperCase();
    }
    if (move.gaveCheck) {
        note += "+";
    }
    return note;
}