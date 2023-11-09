package com.chessin.model.utils;

import com.chessin.model.playing.ChessGame;
import com.chessin.model.playing.GameType;
import jakarta.persistence.criteria.CriteriaBuilder;

import java.util.HashMap;
import java.util.Map;

import static java.lang.Character.isUpperCase;
import static java.lang.Character.toLowerCase;

public class HelpMethods {

    public static int[] getPositionFromHashmap(HashMap<Integer, Integer> pieces)
    {
        int[] position = new int[64];
        for(Map.Entry<Integer, Integer> entry : pieces.entrySet())
        {
            position[entry.getKey()] = entry.getValue();
        }
        return position;
    }
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

    public static GameType getGameType(long timeControl, long increment)
    {
        if(timeControl + (25 * increment) >= 3600000)
            return GameType.CLASSICAL;
        else if(timeControl + (25 * increment) > 600000)
            return GameType.RAPID;
        else if(timeControl + (25 * increment) >= 180000)
            return GameType.BLITZ;
        else
            return GameType.BULLET;
    }

    public static int getDisconnectionTime(GameType gameType)
    {
        return switch (gameType) {
                    case CLASSICAL -> 120000;
                    case RAPID -> 60000;
                    case BLITZ -> 30000;
                    case BULLET -> 20000;
                };
    }
}
