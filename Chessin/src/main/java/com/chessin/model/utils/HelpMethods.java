package com.chessin.model.utils;

import static java.lang.Character.isUpperCase;
import static java.lang.Character.toLowerCase;

public class HelpMethods {
    public static int CharPieceToInt(Character p){
        return switch (toLowerCase(p)) {
            case 'q' -> Constants.Pieces.Queen + addPieceColorValue(p);
            case 'k' -> Constants.Pieces.King + addPieceColorValue(p);
            case 'p' -> Constants.Pieces.Pawn + addPieceColorValue(p);
            case 'r' -> Constants.Pieces.Rook + addPieceColorValue(p);
            case 'n' -> Constants.Pieces.Knight + addPieceColorValue(p);
            case 'b' -> Constants.Pieces.Bishop + addPieceColorValue(p);
            default -> 0;
        };
    }

    public static int addPieceColorValue(Character p){
        return (isUpperCase(p)? Constants.Pieces.White: Constants.Pieces.Black);
    }

    public static String fieldNumberToChessNotation(int fieldNumber){
        return Constants.Letters.ALPHABET[fieldNumber%8] + Integer.toString(8-fieldNumber/8);
    }

    public static Character intToCharPiece(int p){
        return switch (p % 8) {
            case 1 -> p < 16 ? 'K' : 'k';
            case 2 -> p < 16 ? 'P' : 'p';
            case 3 -> p < 16 ? 'R' : 'r';
            case 4 -> p < 16 ? 'N' : 'n';
            case 5 -> p < 16 ? 'B' : 'b';
            case 6 -> p < 16 ? 'Q' : 'q';
            default -> ' ';
        };
    }

    public static int CharPieceToInt2(Character p){
        return switch (toLowerCase(p)) {
            case 'q' -> Constants.Pieces.Queen;
            case 'k' -> Constants.Pieces.King;
            case 'p' -> Constants.Pieces.Pawn;
            case 'r' -> Constants.Pieces.Rook;
            case 'n' -> Constants.Pieces.Knight;
            case 'b' -> Constants.Pieces.Bishop;
            default -> 0;
        };
    }

    public static boolean containsUpperCaseLetter(String str){
        for(char i : str.toCharArray()){
            if(isUpperCase(i)) return true;
        }
        return false;
    }

    public static int getLetterIndexInAlphabet(char letter){
        for(int i = 0; i< Constants.Letters.ALPHABET.length; i++){
            if(Character.toLowerCase(letter) == Constants.Letters.ALPHABET[i]) return i;
        }
        return -1;
    }
}
