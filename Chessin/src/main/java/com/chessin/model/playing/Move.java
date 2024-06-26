package com.chessin.model.playing;

import com.chessin.model.utils.Constants;
import com.chessin.model.utils.HelpMethods;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.context.annotation.Primary;

import java.util.HashMap;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Move {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long Id;
    @ManyToOne(fetch = FetchType.EAGER)
    private ChessGame chessGame;
    private int movedPiece;
    private int startField;
    private int endField;
    private int takenPiece;
    private int promotePiece;
    private int takenPieceField;
    int movesTo50MoveRule;
    int[] availableCastles;
    long remainingTime;
    @Column(length = 512)
    int[] position;

    public Move(ChessGame game, HashMap<Integer, Integer> pieces, int startField, int endField, int promotePiece){
        this.chessGame = game;
        this.startField = startField;
        this.endField = endField;
        this.movedPiece = pieces.get(startField);
        this.takenPiece = calcTakenPiece(pieces);
        this.takenPieceField = calcTakenPieceField(pieces);
        this.promotePiece = promotePiece;
        this.position = HelpMethods.getPositionFromHashmap(pieces);
    }

    public Move(HashMap<Integer, Integer> pieces, int startField, int endField){
        this.startField = startField;
        this.endField = endField;
        this.movedPiece = pieces.get(startField);
        this.takenPiece = calcTakenPiece(pieces);
        this.takenPieceField = calcTakenPieceField(pieces);
        this.position = HelpMethods.getPositionFromHashmap(pieces);
    }

    public void setPosition(HashMap<Integer, Integer> position){
        this.position = HelpMethods.getPositionFromHashmap(position);
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
