package com.chessin.model.utils;

import com.chessin.model.playing.Board;
import com.chessin.model.playing.Move;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import static com.chessin.model.playing.Board.findKing;
import static com.nimbusds.oauth2.sdk.util.StringUtils.isNumeric;
import static java.lang.Character.*;
import static java.lang.Character.toUpperCase;

public class Convert {
    public static int[] FenToIntArray(String fen, int arrayLength){
        int num = 0;
        int[] arr = new int[arrayLength];
        for(Character currChar : fen.toCharArray()){
            if(currChar=='/'){
                continue;
            }

            if(isDigit(currChar)){
                int max = getNumericValue(currChar);
                for(int i = 0; i<max; i++){
                    arr[num] = Constants.Pieces.None;
                }
                num+=max;
                continue;
            }

            arr[num] = HelpMethods.CharPieceToInt(currChar);
            num++;

        }
        return arr;
    }

    public static HashMap<Integer, Integer> boardToMap(int[] board){
        HashMap<Integer, Integer> map = new HashMap<>();
        for(int i = 0; i<board.length; i++){
            if(board[i] != 0)
                map.put(i, board[i]);
        }
        return map;
    }

    public static int[] mapToBoard(HashMap<Integer, Integer> map){
        int[] board = new int[64];
        for (Map.Entry<Integer, Integer> entry : map.entrySet()) {
            board[entry.getKey()] = entry.getValue();
        }
        return board;
    }

//    public static String moveToChessNotation(Board board, Move move) {
//        String note = "";
//        if (move.getMovedPiece() == Constants.Pieces.King && move.getEndField() - move.getStartField() == 2) {
//            note = "O-O";
//        } else if (move.getMovedPiece() == Constants.Pieces.King && move.getEndField() - move.getStartField() == -2) {
//            note = "O-O-O";
//        } else if (move.getMovedPiece() % 8 != 2) {
//            note += toUpperCase(HelpMethods.intToCharPiece(move.getMovedPiece()));
//        } else if (move.getMovedPiece() == Constants.Pieces.Pawn) {
//            for (Map.Entry<Integer, Integer> set :
//                    board.getPosition().entrySet()) {
//                if (set.getValue() != Constants.Pieces.Pawn && move.getTakenPiece() == 0) continue;
//                note += Constants.Letters.ALPHABET[move.getStartField() % 8];
//                break;
//            }
//        }
//
//        if (move.getMovedPiece() % 8 != Constants.Pieces.Pawn && move.getMovedPiece() % 8 != Constants.Pieces.King) {
//            ArrayList<Integer> fromWhereCouldMove = board.canMoveToSquare(move.getStartField(), move.getEndField(), move.getMovedPiece());
//            if (fromWhereCouldMove.size() > 1) {
//                boolean row = false;
//                boolean col = false;
//                for (int i : fromWhereCouldMove) {
//                    if (i % 8 == move.getStartField() % 8) {
//                        note += i / 8;
//                        row = true;
//                    } else if (i / 8 == move.getStartField() / 8) {
//                        note += Constants.Letters.ALPHABET[i % 8];
//                        break;
//                    }
//                }
//                if (!row && col == true) {
//                    note += Constants.Letters.ALPHABET[move.getStartField() % 8];
//                }
//            }
//        }
//
//        if (move.getTakenPiece() != 0) {
//            if (move.getMovedPiece() % 8 == Constants.Pieces.Pawn) {
//                note += Constants.Letters.ALPHABET[move.getStartField() % 8];
//            }
//            note += "x";
//
//        }
//        note += HelpMethods.fieldNumberToChessNotation(move.getEndField());
//        if (move.getPromotePiece() != 0) {
//            note += "=" + toUpperCase(HelpMethods.intToCharPiece(move.getPromotePiece()));
//        }
//        if (move.isGaveCheck()) {
//            note += "+";
//        }
//        return note;
//    }

//    public static Move chessNotationToMove(Board board, String notation){
//        char[] notationArr = notation.toCharArray();
//        Move move = new Move();
//        if(notation.equals("O-O")){
//            return new Move(board.getPosition(), findKing(board), findKing(board) + 2);
//        }
//        else if(notation.equals("O-O-O")){
//            return new Move(board.getPosition(), findKing(board), findKing(board) - 2);
//        }
//        else if(!notation.contains("=") && HelpMethods.containsUpperCaseLetter(notation)){
//            move.setMovedPiece(HelpMethods.CharPieceToInt2(notationArr[0]) + (board.isWhiteTurn() ? Constants.Pieces.White : Constants.Pieces.Black));
//
//            if(notation.contains("x")){
//                move.setEndField(HelpMethods.getLetterIndexInAlphabet(notationArr[notation.indexOf('x') + 1]) + (8 - Character.getNumericValue(notationArr[notation.indexOf('x') + 2])) * 8);
//                move.setTakenPieceField(move.getEndField());
//                move.setTakenPiece(board.getVisualBoard()[move.getTakenPieceField()]);
//            }
//            else{
//                move.setEndField(HelpMethods.getLetterIndexInAlphabet(notationArr[1]) + (8 - Character.getNumericValue(notationArr[2])) * 8);
//            }
//
//            ArrayList<Integer> moves = new ArrayList<>();
//            if(move.getMovedPiece() %8 == Constants.Pieces.King){
//                move.setStartField(findKing(board));
//            }else{
//                moves = board.canMoveToSquare(move.getEndField(), move.getMovedPiece());
//            }
//            if(moves.size()>1){
//                if(isNumeric(Character.toString(notationArr[2]))){
//                    move.setStartField(HelpMethods.getLetterIndexInAlphabet(notationArr[1]) + (8 - Character.getNumericValue(notationArr[2])) * 8);
//                }else
//                    for(int i : moves){
//                        if(isNumeric(Character.toString(notationArr[1])) &&8-i/8 == Character.getNumericValue(notationArr[1]) || !isNumeric(Character.toString(notationArr[1])) && i%8 == HelpMethods.getLetterIndexInAlphabet(notationArr[1])){
//                            move.setStartField(i);
//                            break;
//                        }
//                    }}else if(moves.size() == 1)
//                move.setStartField(moves.get(0));
//        }else{
//            move.setMovedPiece(Constants.Pieces.Pawn + (board.isWhiteTurn() ? Constants.Pieces.White : Constants.Pieces.Black));
//            if(notation.contains("x")){
//                move.setEndField(HelpMethods.getLetterIndexInAlphabet(notationArr[notation.indexOf('x') + 1]) + (8 - Character.getNumericValue(notationArr[notation.indexOf('x') + 2])) * 8);
//                move.setStartField(((board.isWhiteTurn() ? move.getEndField() + 8 : move.getEndField() - 8) / 8) * 8 + HelpMethods.getLetterIndexInAlphabet(notationArr[notation.indexOf('x') - 1]));
//                move.setTakenPiece(board.getVisualBoard()[move.getEndField()] != 0 ? board.getVisualBoard()[move.getEndField()] : Constants.Pieces.Pawn);
//                move.setTakenPieceField(board.getVisualBoard()[move.getEndField()] != 0 ? move.getEndField() : (move.getStartField() / 8) * 8 + HelpMethods.getLetterIndexInAlphabet(notationArr[0]));
//            }else{
//                int col = HelpMethods.getLetterIndexInAlphabet(notationArr[0]);
//                move.setEndField(col + (8 - Character.getNumericValue(notationArr[1])) * 8);
//                for(int i = 0; i<8; i++){
//                    if(board.getVisualBoard()[i*8 + col]  == (Constants.Pieces.Pawn + (board.isWhiteTurn() ? Constants.Pieces.White : Constants.Pieces.Black))) {
//                        move.setStartField(i * 8 + col);
//                    }
//                }
//
//            }
//            if(notation.contains("=")){
//                move.setPromotePiece(HelpMethods.CharPieceToInt2(notationArr[notation.indexOf('=') + 1]) + (board.isWhiteTurn() ? Constants.Pieces.White : Constants.Pieces.Black));
//            }
//        }
//
//        move.setGaveCheck(notation.contains("+"));
//        return move;
//    }
}
