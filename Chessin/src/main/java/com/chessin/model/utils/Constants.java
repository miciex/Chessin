package com.chessin.model.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

public class Constants {
    public static class Letters {

        public static final char[] ALPHABET = new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
                'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' };
    }

    public static class Pieces {
        public static final int None = 0;
        public static final int King = 1;
        public static final int Pawn = 2;
        public static final int Rook = 3;
        public static final int Knight = 4;
        public static final int Bishop = 5;
        public static final int Queen = 6;

        public static final int White = 8;
        public static final int Black = 16;

        public static final int[] PIECES_ARRAY = new int[] { King, Pawn, Rook, Knight, Bishop, Queen };

        public static final int KingValue = Integer.MAX_VALUE;
        public static final int PawnValue = 100;
        public static final int RookValue = 500;
        public static final int KnightValue = 300;
        public static final int BishopValue = 300;
        public static final int QueenValue = 900;
        public static final int[] PROMOTE_PIECES = { Rook, Knight, Bishop, Queen };
        public static final char[] CHAR_PIECES = new char[] { 'K', 'Q', 'B', 'N', 'R', 'P' };
    }

    public static final HashMap<Integer, ArrayList<Integer>> Directions = new HashMap<>() {
        {
            put(Pieces.Queen, new ArrayList<Integer>(Arrays.asList(8, -8, 1, -1, 7, -7, 9, -9)));
            put(Pieces.Rook, new ArrayList<Integer>(Arrays.asList(1, -1, 8, -8)));
            put(Pieces.Bishop, new ArrayList<Integer>(Arrays.asList(7, -7, 9, -9)));
            put(Pieces.Pawn, new ArrayList<Integer>(Arrays.asList(8, 16, 7, 9)));
            put(Pieces.King, new ArrayList<Integer>(Arrays.asList(1, -1, 8, -8, 7, -7, 9, -9)));
            put(Pieces.Knight, new ArrayList<Integer>(Arrays.asList(15, -15, 17, -17, 6, -6, 10, -10)));
            put(2137, new ArrayList<Integer>(
                    Arrays.asList(1, -1, 8, -8, 7, -7, 9, -9, 15, -15, 17, -17, 6, -6, 10, -10)));
        }
    };
}
