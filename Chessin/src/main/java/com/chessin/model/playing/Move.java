package com.chessin.model.playing;

import com.chessin.model.utils.Constants;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Move {
    @Id
    private long chessGameId;
    private int movedPiece;
    private int startField;
    private int endField;
    private int takenPiece;
    private int promotePiece;
    private boolean gaveCheck;
    private int takenPieceField;

    public Move(HashMap<Integer, Integer> pieces, int startField, int endField, int promotePiece){
        this.startField = startField;
        this.endField = endField;
        this.movedPiece = pieces.get(startField);
        this.takenPiece = calcTakenPiece(pieces);
        this.takenPieceField = calcTakenPieceField(pieces);
        this.promotePiece = promotePiece;
    }

    public Move(HashMap<Integer, Integer> pieces, int startField, int endField){
        this.startField = startField;
        this.endField = endField;
        this.movedPiece = pieces.get(startField);
        this.takenPiece = calcTakenPiece(pieces);
        this.takenPieceField = calcTakenPieceField(pieces);
    }

    private int calcTakenPiece(HashMap<Integer, Integer> pieces){
        if(pieces.containsKey(this.endField)) return pieces.get(this.endField);
        if((movedPiece%8) == Constants.Pieces.Pawn && (startField - endField) % 8 != 0)
            return Constants.Pieces.Pawn + (movedPiece > 16 ? Constants.Pieces.White : Constants.Pieces.Black);
        return 0;
    }

    private int calcTakenPieceField(HashMap<Integer, Integer> pieces){
        if(this.takenPiece == 0)  return -1;
        if(movedPiece%8 == Constants.Pieces.Pawn && !pieces.containsKey(endField))
            return startField + endField % 8 - startField % 8;
        return endField;
    }
}
